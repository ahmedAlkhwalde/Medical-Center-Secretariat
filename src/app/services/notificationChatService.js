// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import apiClient from "../config/apiClient";

// export const NOTIFICATION_KEYS = {
//   all: ["notifications"],
//   list: () => [...NOTIFICATION_KEYS.all, "list"],
//   count: () => [...NOTIFICATION_KEYS.all, "count"],
// };

// class NotificationService {
  
//   // APIs Calls
//   async updateFcmTokenApi(fcmToken) {
//     const response = await apiClient.post('/update-fcm-token', { fcm_token: fcmToken });
//     return response.data;
//   }

//   async getMyNotificationsApi() {
//     const response = await apiClient.get('/notification/my-notifications');
//     return response.data;
//   }

//   async getNotificationCountApi() {
//     const response = await apiClient.get('/notification/my-notifications/count');
//     return response.data;
//   }

//   async deleteAllNotificationsApi() {
//     const response = await apiClient.delete('/notification/my-notifications/delete-all');
//     return response.data;
//   }

//   async markAsReadApi(uuid) {
//     const response = await apiClient.patch(`/notification/my-notifications/${uuid}/seen`);
//     return response.data;
//   }

//   async deleteNotificationApi(uuid) {
//     const response = await apiClient.delete(`/notification/my-notifications/${uuid}/delete`);
//     return response.data;
//   }

//   // TanStack Query Hooks
//   useGetNotifications() {
//     return useQuery({
//       queryKey: NOTIFICATION_KEYS.list(),
//       queryFn: async () => {
//         const response = await this.getMyNotificationsApi();
//         return response?.success ? response.data : [];
//       },
//       staleTime: 1000 * 60 * 5,
//     });
//   }

//   useGetNotificationCount() {
//     return useQuery({
//       queryKey: NOTIFICATION_KEYS.count(),
//       queryFn: async () => {
//         const response = await this.getNotificationCountApi();
//         return response?.success ? response.count : 0;
//       },
//       staleTime: 1000 * 60 * 2,
//     });
//   }

//   useUpdateFcmTokenMutation() {
//     return useMutation({
//       mutationFn: (fcmToken) => this.updateFcmTokenApi(fcmToken),
//     });
//   }

//   useMarkAsReadMutation() {
//     const queryClient = useQueryClient();
//     return useMutation({
//       mutationFn: (uuid) => this.markAsReadApi(uuid),
//       onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all }),
//     });
//   }

//   useDeleteNotificationMutation() {
//     const queryClient = useQueryClient();
//     return useMutation({
//       mutationFn: (uuid) => this.deleteNotificationApi(uuid),
//       onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all }),
//     });
//   }

//   useDeleteAllNotificationsMutation() {
//     const queryClient = useQueryClient();
//     return useMutation({
//       mutationFn: () => this.deleteAllNotificationsApi(),
//       onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all }),
//     });
//   }
// }

// export default new NotificationService();






import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../config/apiClient"; // تذكر إرجاع خطوتين للخلف حسب مسار ملفك
import { messaging, requestForToken } from "../../firebase"; // 👈 استيراد إعدادات الفايربيس الخاصة بك
import { onMessage } from "firebase/messaging"; // 👈 استيراد تابع الاستماع من مكتبة الفايربيس

export const NOTIFICATION_KEYS = {
  all: ["notifications"],
  list: () => [...NOTIFICATION_KEYS.all, "list"],
  count: () => [...NOTIFICATION_KEYS.all, "count"],
};

class NotificationService {
  
  // ==========================================
  // 🔔 1. منطق الفايربيس المدمج (Firebase Logic)
  // ==========================================

  /**
   * إعداد الفايربيس وجلب التوكن وتحديثه بالسيرفر مباشرة
   */
  async initializeFCM(isTokenProcessedRef) {
    if (isTokenProcessedRef.current) return null;

    try {
      if (Notification.permission === "granted" || Notification.permission === "default") {
        const token = await requestForToken();
        
        if (token && !isTokenProcessedRef.current) {
          console.log("🔥 تم الحصول على FCM Token دمجاً داخل السيرفس:", token);
          
          // استدعاء دالة الـ API الموجودة بنفس الكلاس بالأسفل
          await this.updateFcmTokenApi(token);
          
          isTokenProcessedRef.current = true;
          return token;
        }
      }
    } catch (error) {
      console.error("❌ فشل تحديث توكن FCM من داخل السيرفس المدمج:", error.message);
    }
    return null;
  }

  /**
   * الاستماع للرسائل في المقدمة (Foreground)
   */
  listenToForegroundMessages() {
    return onMessage(messaging, (payload) => {
      console.log("🔔 تم استلام البيانات في المقدمة عبر NotificationService:", payload);
    });
  }

  // ==========================================
  // 🌐 2. دالات الـ API (Axios Calls) كما هي لديك
  // ==========================================

  async updateFcmTokenApi(fcmToken) {
    const response = await apiClient.post('/update-fcm-token', { fcm_token: fcmToken });
    return response.data;
  }

  async getMyNotificationsApi() {
    const response = await apiClient.get('/notification/my-notifications');
    return response.data;
  }

  async getNotificationCountApi() {
    const response = await apiClient.get('/notification/my-notifications/count');
    return response.data;
  }

  async deleteAllNotificationsApi() {
    const response = await apiClient.delete('/notification/my-notifications/delete-all');
    return response.data;
  }

  async markAsReadApi(uuid) {
    const response = await apiClient.patch(`/notification/my-notifications/${uuid}/seen`);
    return response.data;
  }

  async deleteNotificationApi(uuid) {
    const response = await apiClient.delete(`/notification/my-notifications/${uuid}/delete`);
    return response.data;
  }

  // ==========================================
  // ⚡ 3. TanStack Query Hooks كما هي لديك
  // ==========================================

  useGetNotifications() {
    return useQuery({
      queryKey: NOTIFICATION_KEYS.list(),
      queryFn: async () => {
        const response = await this.getMyNotificationsApi();
        return response?.success ? response.data : [];
      },
      staleTime: 1000 * 60 * 5,
    });
  }

  useGetNotificationCount() {
    return useQuery({
      queryKey: NOTIFICATION_KEYS.count(),
      queryFn: async () => {
        const response = await this.getNotificationCountApi();
        return response?.success ? response.count : 0;
      },
      staleTime: 1000 * 60 * 2,
    });
  }

  useUpdateFcmTokenMutation() {
    return useMutation({
      mutationFn: (fcmToken) => this.updateFcmTokenApi(fcmToken),
    });
  }

  useMarkAsReadMutation() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (uuid) => this.markAsReadApi(uuid),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all }),
    });
  }

  useDeleteNotificationMutation() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (uuid) => this.deleteNotificationApi(uuid),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all }),
    });
  }

  useDeleteAllNotificationsMutation() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: () => this.deleteAllNotificationsApi(),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all }),
    });
  }
}

export default new NotificationService();