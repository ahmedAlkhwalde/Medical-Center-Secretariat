import { motion as Motion } from "framer-motion";
import { CheckCircleOutline, DeleteOutline, Chat, Event } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import ButtonSpinner from "./ButtonSpinner";

const NotificationItem = ({
  item,
  markAsReadMutation,
  deleteNotificationMutation,
  onClick,
}) => {
  const isChat = item.type === "chat";

  const isItemMarkingRead = markAsReadMutation.isPending && markAsReadMutation.variables === item.uuid;
  const isItemDeleting = deleteNotificationMutation.isPending && deleteNotificationMutation.variables === item.uuid;
  const isAnyActionPending = isItemMarkingRead || isItemDeleting;

  return (
    <Motion.div
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
      onClick={() => onClick(item)}
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
          {isChat ? <Chat className="text-[18px]" /> : <Event className="text-[18px]" />}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className={`text-sm tracking-wide truncate ${item.is_read ? "font-medium theme-text" : "font-black theme-text"}`}>
              {item.title}
            </h3>
            {!item.is_read && !isItemMarkingRead && (
              <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] shrink-0 animate-pulse" />
            )}
          </div>
          <p className="text-xs theme-text-muted leading-relaxed whitespace-pre-wrap font-medium">{item.body}</p>
          <span className="text-[10px] theme-text-muted block pt-1 font-semibold">
            {item.created_at
              ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ar })
              : ""}
          </span>
        </div>
      </div>

      <div
        className={`flex items-center gap-1 transition-all duration-200 shrink-0 pl-1 rounded-xl
        ${item.is_read ? "theme-surface" : "bg-transparent"}
        ${isAnyActionPending ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-within:opacity-100"}`}
      >
        {!item.is_read && (
          <button
            disabled={isAnyActionPending}
            onClick={(e) => { e.stopPropagation(); markAsReadMutation.mutate(item.uuid); }}
            title="تعيين كمقروء"
            className="p-1.5 rounded-xl theme-text-muted hover:text-[var(--color-success)] hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isItemMarkingRead ? <ButtonSpinner className="w-[18px] h-[18px] text-[var(--color-success)]" /> : <CheckCircleOutline className="text-[18px]" />}
          </button>
        )}

        <button
          disabled={isAnyActionPending}
          onClick={(e) => { e.stopPropagation(); deleteNotificationMutation.mutate(item.uuid); }}
          title="حذف الإشعار"
          className="p-1.5 rounded-xl theme-text-muted theme-hover-danger transition-colors cursor-pointer disabled:opacity-50"
        >
          {isItemDeleting ? <ButtonSpinner className="w-[18px] h-[18px] theme-text-danger" /> : <DeleteOutline className="text-[18px]" />}
        </button>
      </div>
    </Motion.div>
  );
};

export default NotificationItem;