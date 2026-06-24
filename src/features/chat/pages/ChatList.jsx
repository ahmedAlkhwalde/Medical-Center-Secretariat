import { useChatList } from "../hooks/useChatList";
import ChatSearchBar from "../components/ChatSearchBar";
import ChatListItem from "../components/ChatListItem";

export default function ChatList() {
  const {
    isLoading,
    filteredChats,
    searchQuery,
    activeChatId,
    handleSearch,
    navigateToChat,
  } = useChatList();

  return (
    <div dir="rtl" className="w-full h-full flex flex-col font-['Cairo'] select-none bg-transparent">
      <ChatSearchBar searchQuery={searchQuery} onSearch={handleSearch} />

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2.5 custom-scrollbar">
        {isLoading ? (
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="flex items-center gap-4 p-3 rounded-2xl border theme-border bg-white/30 dark:bg-slate-900/20 animate-pulse"
              >
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3.5 bg-gray-200 dark:bg-slate-800 rounded-md w-1/3" />
                  <div className="h-2.5 bg-gray-200 dark:bg-slate-800 rounded-md w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col h-48 items-center justify-center text-center p-6">
            <p className="text-sm font-medium theme-text-muted">لا توجد محادثات مطابقة للبحث</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={activeChatId === chat.id}
              onClick={() => navigateToChat(chat)}
            />
          ))
        )}
      </div>
    </div>
  );
}