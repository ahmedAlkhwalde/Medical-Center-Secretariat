import React from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Notifications,
  DeleteSweep,
  CheckCircleOutline,
  DeleteOutline,
  Chat,
  Event,
  NotificationsNone,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import notificationService from "../../services/notificationChatService";

// مكون الـ Spinner الموحد
const ButtonSpinner = ({ className = "w-4 h-4 text-current" }) => (
  <span
    className={`animate-spin inline-block rounded-full border-2 border-solid border-current border-t-transparent ${className}`}
  />
);

export default function NotificationPage() {
  const navigate = useNavigate();

  const {
    data: notifications = [],
    isLoading,
    isFetching,
  } = notificationService.useGetNotifications();

  const markAsReadMutation = notificationService.useMarkAsReadMutation();
  const deleteNotificationMutation =
    notificationService.useDeleteNotificationMutation();
  const deleteAllNotificationsMutation =
    notificationService.useDeleteAllNotificationsMutation();

  const handleNotificationClick = async (notification) => {
    if (deleteNotificationMutation.isPending || markAsReadMutation.isPending)
      return;

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

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-3" dir="rtl">
        <div className="h-12 w-48 theme-border bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse mb-6" />
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="flex items-start gap-4 p-4 rounded-2xl border theme-border theme-surface-90 animate-pulse"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-slate-800 shrink-0" />
            <div className="flex-1 space-y-2.5 py-1">
              <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-md w-1/4" />
              <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded-md w-3/4" />
              <div className="h-2 bg-gray-200 dark:bg-slate-800 rounded-md w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-5 select-none" dir="rtl">
      {/* الهيدر */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b theme-border pb-5">
        <div className="flex items-center gap-3.5">
          <div className="p-3 theme-accent-soft theme-text-accent rounded-2xl relative">
            <Notifications className="text-[26px]" />
            {isFetching && (
              <span className="absolute top-0 right-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-accent)]"></span>
              </span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-black theme-text tracking-wide">
              مركز الإشعارات
            </h1>
            <p className="text-xs theme-text-muted mt-0.5">
              إدارة وتتبع تنبيهات النظام والمحادثات الحية
            </p>
          </div>
        </div>

        <AnimatePresence>
          {notifications.length > 0 && (
            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <button
                onClick={() => deleteAllNotificationsMutation.mutate()}
                disabled={deleteAllNotificationsMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold theme-text-danger theme-hover-danger rounded-xl border border-transparent transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {deleteAllNotificationsMutation.isPending ? (
                  <ButtonSpinner className="w-3.5 h-3.5 theme-text-danger" />
                ) : (
                  <DeleteSweep fontSize="small" />
                )}
                حذف جميع الإشعارات
              </button>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* صندوق الإشعارات */}
      {notifications.length === 0 ? (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-72 flex-col items-center justify-center text-center border-2 border-dashed theme-border rounded-3xl p-8 theme-surface-90"
        >
          <div className="p-4 theme-surface rounded-full mb-3 theme-text-muted">
            <NotificationsNone className="h-10 w-10" />
          </div>
          <p className="text-base font-bold theme-text">
            صندوق الإشعارات فارغ حالياً
          </p>
          <p className="text-xs theme-text-muted mt-1.5 max-w-sm">
            عندما تتلقى تنبيهات جديدة من الإدارة أو رسائل شات فورية من المرضى
            ستظهر هنا تلقائياً.
          </p>
        </Motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {notifications.map((item) => {
              const isChat = item.type === "chat";

              // استخدام isPending بدلاً من isLoading
              const isItemMarkingRead =
                markAsReadMutation.isPending &&
                markAsReadMutation.variables === item.uuid;
              const isItemDeleting =
                deleteNotificationMutation.isPending &&
                deleteNotificationMutation.variables === item.uuid;
              const isAnyActionPending = isItemMarkingRead || isItemDeleting;

              return (
                <Motion.div
                  key={item.uuid}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  className={`flex items-start justify-between gap-4 p-4 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden
                    ${
                      item.is_read
                        ? "theme-surface theme-border opacity-70 hover:opacity-100"
                        : "theme-accent-soft theme-border shadow-sm hover:shadow-md"
                    } ${isAnyActionPending ? "pointer-events-none opacity-50" : ""}`}
                  onClick={() => handleNotificationClick(item)}
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div
                      className={`p-3 rounded-xl shrink-0 transition-transform group-hover:scale-105 duration-200
                      ${
                        item.is_read
                          ? "theme-surface theme-text-muted border theme-border"
                          : isChat
                            ? "bg-[var(--color-success)] text-white"
                            : "theme-accent theme-text-on-accent"
                      }`}
                    >
                      {isChat ? (
                        <Chat className="text-[18px]" />
                      ) : (
                        <Event className="text-[18px]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`text-sm tracking-wide truncate ${item.is_read ? "font-medium theme-text" : "font-black theme-text"}`}
                        >
                          {item.title}
                        </h3>
                        {!item.is_read && !isItemMarkingRead && (
                          <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] shrink-0 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs theme-text-muted leading-relaxed whitespace-pre-wrap font-medium">
                        {item.body}
                      </p>
                      <span className="text-[10px] theme-text-muted block pt-1 font-semibold">
                        {item.created_at
                          ? formatDistanceToNow(new Date(item.created_at), {
                              addSuffix: true,
                              locale: ar,
                            })
                          : ""}
                      </span>
                    </div>
                  </div>

                  {/* أزرار التحكم */}
                  <div
                    className={`flex items-center gap-1 transition-all duration-200 shrink-0 pl-1 rounded-xl
                    ${item.is_read ? "theme-surface" : "bg-transparent"}
                    ${isAnyActionPending ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-within:opacity-100"}`}
                  >
                    {!item.is_read && (
                      <button
                        disabled={isAnyActionPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsReadMutation.mutate(item.uuid);
                        }}
                        title="تعيين كمقروء"
                        className="p-1.5 rounded-xl theme-text-muted hover:text-[var(--color-success)] hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isItemMarkingRead ? (
                          <ButtonSpinner className="w-[18px] h-[18px] text-[var(--color-success)]" />
                        ) : (
                          <CheckCircleOutline className="text-[18px]" />
                        )}
                      </button>
                    )}

                    <button
                      disabled={isAnyActionPending}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotificationMutation.mutate(item.uuid);
                      }}
                      title="حذف الإشعار"
                      className="p-1.5 rounded-xl theme-text-muted theme-hover-danger transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isItemDeleting ? (
                        <ButtonSpinner className="w-[18px] h-[18px] theme-text-danger" />
                      ) : (
                        <DeleteOutline className="text-[18px]" />
                      )}
                    </button>
                  </div>
                </Motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}