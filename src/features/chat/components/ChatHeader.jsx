import { ArrowLeft } from "lucide-react";

const ChatHeader = ({ chatName, avatarUrl, role, finalPresence, formatLastSeen, onBack }) => (
  <header className="flex h-16 w-full items-center justify-between border-b theme-border theme-surface px-4 shadow-sm flex-shrink-0 z-10">
    <div className="flex items-center gap-3">
      <button onClick={onBack} className="rounded-full p-1 theme-hover-surface">
        <ArrowLeft className="h-6 w-6 theme-text" />
      </button>

      <div className="relative">
        {avatarUrl && avatarUrl !== "group_placeholder" ? (
          <img src={avatarUrl} alt={chatName} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full theme-accent-soft theme-text-accent">
            <span className="font-bold">{chatName ? chatName[0] : "?"}</span>
          </div>
        )}

        {(finalPresence?.status === "online" || finalPresence?.isOnline === true) && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-900" />
        )}
      </div>

      <div>
        <h2 className="text-sm font-bold max-w-[200px] truncate theme-text">{chatName}</h2>
        <p className="text-xs theme-text-muted">
          {role} • {formatLastSeen(finalPresence)}
        </p>
      </div>
    </div>
  </header>
);

export default ChatHeader;