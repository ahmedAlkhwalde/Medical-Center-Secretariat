import { Search } from "lucide-react";

const ChatSearchBar = ({ searchQuery, onSearch }) => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-sm border theme-border bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm focus-within:ring-2 focus-within:ring-teal-500/20 transition-all duration-200">
        <Search className="h-4 w-4 text-teal-500 min-w-[18px]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="بحث عن زميل أو مراجع..."
          className="w-full bg-transparent outline-none text-sm font-medium theme-text placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>
    </div>
  );
};

export default ChatSearchBar;