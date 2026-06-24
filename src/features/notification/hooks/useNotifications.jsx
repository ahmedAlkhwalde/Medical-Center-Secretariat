import { useNavigate } from "react-router-dom";
import notificationService from "../service/notificationChatService";

export const useNotifications = () => {
  const navigate = useNavigate();

  const {
    data: notifications = [],
    isLoading,
    isFetching,
  } = notificationService.useGetNotifications();

  const markAsReadMutation = notificationService.useMarkAsReadMutation();
  const deleteNotificationMutation = notificationService.useDeleteNotificationMutation();
  const deleteAllNotificationsMutation = notificationService.useDeleteAllNotificationsMutation();

  const handleNotificationClick = async (notification) => {
    if (deleteNotificationMutation.isPending || markAsReadMutation.isPending) return;

    if (!notification.is_read) {
      await markAsReadMutation.mutateAsync(notification.uuid);
    }

    const data = notification.data || {};

    if (notification.type === "chat" || data.chatId) {
      navigate("/main-page/chat-view", {
        state: {
          chatId: data.chatId,
          currentUserId: data.receiverId,
          chatName: data.senderName || "محادثة مريض",
          avatarUrl: data.avatarUrl || "",
          role: "مريض مراجع",
          isActive: true,
        },
      });
    } else if (notification.type === "appointment" || data.appointmentId) {
      navigate("/main-page/appointments");
    }
  };

  return {
    notifications,
    isLoading,
    isFetching,
    markAsReadMutation,
    deleteNotificationMutation,
    deleteAllNotificationsMutation,
    handleNotificationClick,
  };
};