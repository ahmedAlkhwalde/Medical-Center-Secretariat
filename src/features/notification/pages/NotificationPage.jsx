import { AnimatePresence } from "framer-motion";
import { useNotifications } from "../hooks/useNotifications";
import NotificationHeader from "../components/NotificationHeader";
import NotificationItem from "../components/NotificationItem";
import EmptyNotifications from "../components/EmptyNotifications";
import NotificationSkeleton from "../components/NotificationSkeleton";

export default function NotificationPage() {
  const {
    notifications,
    isLoading,
    isFetching,
    markAsReadMutation,
    deleteNotificationMutation,
    deleteAllNotificationsMutation,
    handleNotificationClick,
  } = useNotifications();

  if (isLoading) return <NotificationSkeleton />;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-5 select-none" dir="rtl">
      <NotificationHeader
        notificationsCount={notifications.length}
        isFetching={isFetching}
        onDeleteAll={() => deleteAllNotificationsMutation.mutate()}
        isDeletingAll={deleteAllNotificationsMutation.isPending}
      />

      {notifications.length === 0 ? (
        <EmptyNotifications />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {notifications.map((item) => (
              <NotificationItem
                key={item.uuid}
                item={item}
                markAsReadMutation={markAsReadMutation}
                deleteNotificationMutation={deleteNotificationMutation}
                onClick={handleNotificationClick}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}