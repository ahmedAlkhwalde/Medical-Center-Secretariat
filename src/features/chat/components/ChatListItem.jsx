import { Users } from "lucide-react";

const ChatListItem = ({ chat, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer border shadow-sm transition-all duration-200 group relative overflow-hidden
        bg-white/70 dark:bg-[#1e293b]/40 theme-border
        ${
          isActive
            ? "!border-teal-500 ring-2 ring-teal-500/10 dark:bg-slate-900/60 shadow-md scale-[0.99]"
            : "hover:bg-white dark:hover:bg-slate-900/20 hover:shadow-md hover:scale-[1.01]"
        }`}
    >
      <div className="relative flex-shrink-0">
        {chat.avatarUrl === "group_placeholder" || !chat.avatarUrl ? (
          <div className="h-12 w-12 rounded-full bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
            <Users className="h-5 w-5 text-teal-500" />
          </div>
        ) : (
          <img
            src={chat.avatarUrl}
            alt={chat.name}
            className="h-12 w-12 rounded-full object-cover border border-gray-100 dark:border-slate-800"
          />
        )}
        {chat.isActive && (
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-2">
          <h3 className={`text-sm tracking-wide truncate ${isActive ? "font-black text-teal-500" : "font-bold theme-text"}`}>
            {chat.name}
          </h3>
          <span className="text-[10px] font-bold tracking-wide text-gray-400 dark:text-gray-500 truncate">
            ({chat.role})
          </span>
        </div>
        <p className="text-xs truncate theme-text-muted font-medium max-w-[90%]">
          {chat.lastMessage}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between h-10 text-left flex-shrink-0">
        <span className={`text-[10px] font-semibold ${isActive ? "text-teal-500" : "text-gray-400 dark:text-gray-500"}`}>
          {chat.time}
        </span>
        {chat.unreadCount > 0 ? (
          <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-teal-500 px-1.5 text-[10px] font-black text-white shadow-sm shadow-teal-500/20 animate-bounce">
            {chat.unreadCount}
          </span>
        ) : (
          <div className="h-4.5 w-4.5" />
        )}
      </div>
    </div>
  );
};

export default ChatListItem;