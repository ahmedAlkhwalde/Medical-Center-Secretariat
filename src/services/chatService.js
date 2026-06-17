// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import apiClient from "../../config/apiClient"; // 💡 تم ضبط المسار حسب الكود الخاص بك

// // 🔑 مفاتيح الكاش (Query Keys) الموحدة الخاصة بالمحادثات
// export const CHAT_KEYS = {
//   all: ["chats"],
//   rooms: () => [...CHAT_KEYS.all, "rooms"],
//   room: (id) => [...CHAT_KEYS.all, "room", id],
// };

// class ChatService {
  
//   // =============================================================
//   // 💬 أولاً: الدوال المباشرة للتعامل مع الـ API (Axios Calls)
//   // =============================================================

//   /**
//    * جلب جهات الاتصال والمحادثات المحتملة للطبيب الحالي
//    */
//   async getPotentialContactsWithUser() {
//     const response = await apiClient.get('/chat/potential-contacts');
//     return response.data;
//   }

//   /**
//    * جلب غرفة المحادثة أو إنشائها مع مريض معين
//    * @param {string|number} patientId 
//    */
//   async getOrCreateRoomApi(patientId) {
//     const response = await apiClient.post('/chat/get-or-create-room', { patient_id: patientId });
//     return response.data;
//   }

//   /**
//    * رفع ملف أو مستند عادي إلى السيرفر (مثل ملفات PDF)
//    * @param {File} file 
//    */
//   async uploadFileApi(file) {
//     const formData = new FormData();
//     formData.append('file', file);
    
//     const response = await apiClient.post('/chat/upload', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     return response.data;
//   }

//   /**
//    * رفع المرفقات الصوتية والصور إلى السيرفر
//    * @param {File} attachment 
//    */
//   async uploadAttachmentApi(attachment) {
//     const formData = new FormData();
//     formData.append('attachment', attachment);
    
//     const response = await apiClient.post('/chat/attachments/upload', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     return response.data;
//   }

//   /**
//    * حفظ بيانات الرسالة في قاعدة بيانات السيرفر (لارافل) بعد إرسالها للفايربيس
//    * @param {Object} messageData 
//    */
//   async storeMessageApi(messageData) {
//     const response = await apiClient.post('/chat/store-message', messageData);
//     return response.data;
//   }


//   // =============================================================
//   // ⚡ ثانياً: طبقة الـ TanStack Query Hooks (للاستهلاك المباشر في الـ UI)
//   // =============================================================

//   /**
//    * 🎯 هوك جلب قائمة المحادثات وجهات الاتصال (المستدعى في ChatList.jsx)
//    */
//   useGetPotentialContacts() {
//     return useQuery({
//       queryKey: CHAT_KEYS.rooms(),
//       queryFn: async () => {
//         const response = await this.getPotentialContactsWithUser();
//         // نرجعه كاملاً لأننا نحتاج الـ data والـ current_user معاً في الـ Component
//         return response || { success: false, data: [], current_user: null };
//       },
//       staleTime: 1000 * 60 * 3, // كاش 3 دقائق
//     });
//   }

//   /**
//    * هوك جلب أو إنشاء غرفة المحادثة
//    */
//   useGetOrCreateRoomMutation() {
//     const queryClient = useQueryClient();
//     return useMutation({
//       mutationFn: (patientId) => this.getOrCreateRoomApi(patientId),
//       onSuccess: () => {
//         queryClient.invalidateQueries({ queryKey: CHAT_KEYS.rooms() });
//       },
//       onError: (error) => console.error("❌ فشل جلب أو إنشاء الغرفة:", error),
//     });
//   }

//   /**
//    * هوك رفع ملف مستندات
//    */
//   useUploadFileMutation() {
//     return useMutation({
//       mutationFn: (file) => this.uploadFileApi(file),
//       onError: (error) => console.error("❌ فشل رفع الملف المستندي:", error),
//     });
//   }

//   /**
//    * هوك رفع المرفقات (صور وريكوردات)
//    */
//   useUploadAttachmentMutation() {
//     return useMutation({
//       mutationFn: (attachment) => this.uploadAttachmentApi(attachment),
//       onError: (error) => console.error("❌ فشل رفع المرفق الحركي:", error),
//     });
//   }

//   /**
//    * هوك تخزين وتثبيت الرسالة في اللارافل
//    */
//   useStoreMessageMutation() {
//     return useMutation({
//       mutationFn: (messageData) => this.storeMessageApi(messageData),
//       onError: (error) => console.error("❌ فشل حفظ الرسالة في السيرفر:", error),
//     });
//   }
// }

// // تصدير كلاس مستقل ونظيف (Singleton) خاص بالمحادثات
// export default new ChatService();





















import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../config/apiClient";

// مفاتيح الكاش (Query Keys)
export const CHAT_KEYS = {
  all: ["chats"],
  rooms: () => [...CHAT_KEYS.all, "rooms"],
  room: (id) => [...CHAT_KEYS.all, "room", id],
};

class ChatService {
  

  async getPotentialContactsWithUser() {
    // تضرب المسار المتوافق مع ApiEndpoints.getAllPotentialContacts
    const response = await apiClient.get('/chat/potential-contacts');
    return response.data; // ترجع الحقول { success, data, current_user }
  }

  /**
   * جلب غرفة المحادثة أو إنشائها مع مريض معين
   * تماثل: getOrCreateRoom في فلاتر
   */
  async getOrCreateRoomApi({ senderId, targetId }) {
    const response = await apiClient.post('/chat/get-or-create-room', {
      target_id: parseInt(targetId), // مطابقة للفلاتر int.parse(targetId)
      sender_id: senderId,
    });
    
    // الفلاتر تتوقع وتستخرج: firebase_room_key و current_user_id
    return response.data;
  }

  async uploadFileOrMediaApi({ file, type, chatRoomId, senderId }) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type); // 'image' أو 'audio'
    formData.append('room_id', chatRoomId);
    formData.append('sender_id', senderId.toString().replace('user_', ''));
    formData.append('text', type === 'image' ? 'أرسل صورة 🖼️' : 'تسجيل صوتي 🎤');

    // الفلاتر ترفع الصور والريكوردات على رابط الـ uploadFile الموحد
    const response = await apiClient.post('/chat/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; // يعيد السيرفر رابط الملف المرفوع في ['url']
  }

  
  async uploadAttachmentApi({ file, fileName, chatRoomId, senderId }) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'document');
    formData.append('room_id', chatRoomId);
    formData.append('sender_id', senderId.toString().replace('user_', ''));
    formData.append('text', fileName);

    // الفلاتر ترفع المستندات على رابط الـ uploadAttachment المنفصل
    const response = await apiClient.post('/chat/attachments/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  /**
   * حفظ بيانات الرسالة ومزامنتها في قاعدة بيانات لارافل
   * تماثل: syncMessageToLaravel في فلاتر
   * 
   */

   async storeMessageApi({ chatRoomId, senderId, type, text, fileUrl }) {
  const cleanSenderId = senderId.toString().replace('user_', '');
  
  const dataMap = {
    "firebase_room_key": chatRoomId ? chatRoomId.toString() : "",
    "room_id": chatRoomId ? chatRoomId.toString() : "", // النص كما هو بفلتر تماماً يا صديقي
    "sender_id": cleanSenderId,
    "type": type,
    // تأمين النص تماماً لكي لا يرسل لارافل خطأ 500 بسبب حقل فارغ في قاعدة البيانات
    "text": text ?? (type === "text" ? "" : type === "image" ? "أرسل صورة 🖼️" : type === "audio" ? "تسجيل صوتي 🎤" : "أرسل ملفاً 📁"),
    "file": fileUrl || null,
    "file_url": fileUrl || null,
  };

  const response = await apiClient.post('/chat/store-message', dataMap);
  return response.data;
}


  useGetPotentialContacts() {
    return useQuery({
      queryKey: CHAT_KEYS.rooms(),
      queryFn: async () => {
        const response = await this.getPotentialContactsWithUser();
        return response || { success: false, data: [], current_user: null };
      },
      staleTime: 1000 * 60 * 3,
    });
  }

  /**
   * هوك جلب أو إنشاء الغرفة (يستقبل الكائن الآن)
   */
  useGetOrCreateRoomMutation() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ senderId, targetId }) => this.getOrCreateRoomApi({ senderId, targetId }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: CHAT_KEYS.rooms() });
      },
      onError: (error) => console.error("❌ فشل جلب أو إنشاء الغرفة:", error),
    });
  }

  /**
   * هوك رفع الميديا (الصور والريكوردات المحدث)
   */
  useUploadMediaMutation() {
    return useMutation({
      mutationFn: ({ file, type, chatRoomId, senderId }) => 
        this.uploadFileOrMediaApi({ file, type, chatRoomId, senderId }),
      onError: (error) => console.error("❌ فشل رفع الميديا المرفقة:", error),
    });
  }

  /**
   * هوك رفع المستندات المحدث
   */
  useUploadAttachmentMutation() {
    return useMutation({
      mutationFn: ({ file, fileName, chatRoomId, senderId }) => 
        this.uploadAttachmentApi({ file, fileName, chatRoomId, senderId }),
      onError: (error) => console.error("❌ فشل رفع المستند المرفق:", error),
    });
  }

  /**
   * هوك مزامنة الرسائل باللارافل
   */
  useStoreMessageMutation() {
    return useMutation({
      mutationFn: (messageData) => this.storeMessageApi(messageData),
      onError: (error) => console.error("❌ فشل مزامنة الرسالة بالسيرفر:", error),
    });
  }
}

export default new ChatService();