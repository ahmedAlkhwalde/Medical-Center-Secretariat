import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { 
  Notifications, 
  DoneAll, 
  DeleteSweep, 
  CheckCircleOutline, 
  DeleteOutline, 
  Chat, 
  Event, 
  NotificationsNone,
//   Loader
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import notificationService from '../../app/services/notificationChatService'; // 👈 عدل المسار حسب مشروعك

export default function NotificationPage() {
  const navigate = useNavigate();

  // ⚡ استدعاء هوكات الـ TanStack Query الحية من الكلاس الخاص بك
  const { data: notifications = [], isLoading, isFetching } = notificationService.useGetNotifications();
  
  const markAsReadMutation = notificationService.useMarkAsReadMutation();
  const deleteNotificationMutation = notificationService.useDeleteNotificationMutation();
  const deleteAllNotificationsMutation = notificationService.useDeleteAllNotificationsMutation();

  // 🔔 دالة التعامل مع الضغط على الإشعار (توجيه ديناميكي تماماً مثل فلوتر)
  const handleNotificationClick = async (notification) => {
    // 1. تعليمه كمقروء في السيرفر فوراً
    if (!notification.is_read) {
      await markAsReadMutation.mutateAsync(notification.uuid);
    }

    // 2. تحليل مكان التوجيه (Deep Linking) بناءً على نوع الإشعار المُرسل من لارافل
    const data = notification.data || {};
    
    if (notification.type === 'chat' || data.chatId) {
      // التوجيه لغرفة الشات مع تمرير الـ State الديناميكي الخاص بك
      navigate('/main-page/chat-view', {
        state: {
          chatId: data.chatId,
          currentUserId: data.receiverId,
          chatName: data.senderName || "محادثة مريض",
          avatarUrl: data.avatarUrl || "",
          role: "مريض مراجع",
          isActive: true
        }
      });
    } else if (notification.type === 'appointment' || data.appointmentId) {
      // توجيه لصفحة المواعيد مثلاً
      navigate('/main-page/appointments');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="text-center">
          {/* <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" /> */}
          <p className="text-xs text-gray-500 dark:text-gray-400">جاري تحميل الإشعارات الحية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4" dir="rtl">
      
      {/* الـ Header الخاص بالصفحة والأزرار التفاعلية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl">
            <Notifications />
          </div>
          <div>
            <h1 className="text-lg font-bold theme-text">مركز الإشعارات</h1>
            <p className="text-xs theme-text-muted">إدارة وتتبع تنبيهات النظام والمحادثات الحية</p>
          </div>
          {/* {isFetching && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />} */}
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => deleteAllNotificationsMutation.mutate()}
              disabled={deleteAllNotificationsMutation.isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-500/10 rounded-xl transition cursor-pointer"
            >
              <DeleteSweep fontSize="small" />
              حذف الكل
            </button>
          </div>
        )}
      </div>

      {/* قائمة عرض الإشعارات */}
      {notifications.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center text-center border border-dashed theme-border rounded-2xl p-6 bg-white/50 dark:bg-slate-900/50">
          <NotificationsNone className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-2" />
          <p className="text-sm font-semibold theme-text">صندوق الإشعارات فارغ</p>
          <p className="text-xs theme-text-muted mt-1">عندما تتلقى تنبيهات جديدة أو رسائل شات ستظهر هنا فوراً.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((item) => {
            const isChat = item.type === 'chat';
            
            return (
              <Motion.div
                key={item.uuid}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start justify-between gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer group
                  ${item.is_read 
                    ? 'bg-white border-gray-100 dark:bg-[#1e293b]/40 dark:border-slate-800/60 opacity-75' 
                    : 'bg-gradient-to-r from-blue-50/50 to-white border-blue-100 dark:from-blue-950/20 dark:to-[#1e293b] dark:border-blue-900/40 shadow-sm'}`}
                onClick={() => handleNotificationClick(item)}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* أيقونة الإشعار بناءً على نوعه */}
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5
                    ${item.is_read 
                      ? 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400' 
                      : 'bg-blue-600 text-white shadow-sm'}`}
                  >
                    {isChat ? <Chat fontSize="small" /> : <Event fontSize="small" />}
                  </div>

                  {/* تفاصيل الإشعار */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm truncate ${item.is_read ? 'font-medium theme-text' : 'font-bold theme-text'}`}>
                        {item.title}
                      </h3>
                      {!item.is_read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs theme-text-muted mt-1 leading-relaxed whitespace-pre-wrap">
                      {item.body}
                    </p>
                    
                    {/* التوقيت النسبي */}
                    <span className="text-[10px] text-gray-400 block mt-1.5">
                      {item.created_at ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ar }) : ''}
                    </span>
                  </div>
                </div>

                {/* أزرار التحكم الفردية تظهر عند الحوم أو ثابتة */}
                <div className="flex items-center gap-1 opacity-15 group-hover:opacity-100 transition-opacity shrink-0">
                  {!item.is_read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsReadMutation.mutate(item.uuid);
                      }}
                      title="تحديد كمقروء"
                      className="p-1 rounded-lg text-gray-400 hover:text-green-500 hover:bg-gray-100 dark:hover:bg-slate-800"
                    >
                      <CheckCircleOutline fontSize="small" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotificationMutation.mutate(item.uuid);
                    }}
                    title="حذف الإشعار"
                    className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    <DeleteOutline fontSize="small" />
                  </button>
                </div>

              </Motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}