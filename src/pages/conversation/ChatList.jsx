import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Search, Users } from 'lucide-react'; 
import chatService from "../../services/chatService";

export default function ChatList({ isDark = true }) {
  const navigate = useNavigate();

  // --- 1. تعريف حالات الـ State المحلية ---
  const [activeChatId, setActiveChatId] = useState("");
  const [allChats, setAllChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState(""); 

  // --- 2. ربط السيرفر باستخدام TanStack Query ---
  const { data: responseMap, isLoading } = chatService.useGetPotentialContacts();

  // مزامنة البيانات القادمة من السيرفر مع الـ States المحلية عند اكتمال الجلب
  useEffect(() => {
    if (responseMap) {
      if (responseMap.current_user) {
        setCurrentUserId(String(responseMap.current_user.id));
        console.log(`✅ تم التقاط ID الطبيب الحالي من السيرفر: ${responseMap.current_user.id}`);
      }

      const rawData = responseMap.data || [];
      setAllChats(rawData);
      
      if (searchQuery.trim() === "") {
        setFilteredChats(rawData);
      }
    }
  }, [responseMap]);

  // --- 3. منطق البحث والتصفية المتوافق ---
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredChats(allChats);
    } else {
      const filtered = allChats.filter(
        (chat) =>
          chat.name?.toLowerCase().includes(query.toLowerCase()) ||
          chat.role?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  };

  // --- 4. منطق الضغط والانتقال للمحادثة ---
  const navigateToChat = (chat) => {
    setActiveChatId(chat.id);

    // تصفير العداد غير المقروء محلياً للغرفة النشطة
    const updatedChats = allChats.map((item) => {
      if (item.id === chat.id) {
        return { ...item, unreadCount: 0 }; 
      }
      return item;
    });

    setAllChats(updatedChats);
    
    if (searchQuery.trim() === "") {
      setFilteredChats(updatedChats);
    } else {
      setFilteredChats(
        updatedChats.filter(
          (item) =>
            item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.role?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // 📝 الانتقال وتمرير المعرفات الحقيقية والديناميكية بالكامل
    navigate(`/main-page/conversations/view/${chat.id}`, { 
      state: {
        chatId: chat.id,          
        currentUserId: currentUserId, 
        chatName: chat.name,
        avatarUrl: chat.avatarUrl,
        role: chat.role,      
        isActive: chat.isActive,
      }
    });
  };

  return (
    <div 
      dir="rtl" 
      className="w-full h-full flex flex-col font-['Cairo'] select-none bg-transparent"
    >
      {/* 1. حقل البحث المتوافق مع ستايل الـ Global index.css */}
      <div className="p-4">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-sm border theme-border bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm focus-within:ring-2 focus-within:ring-teal-500/20 transition-all duration-200">
          <Search className="h-4 w-4 text-teal-500 min-w-[18px]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="بحث عن زميل أو مراجع..."
            className="w-full bg-transparent outline-none text-sm font-medium theme-text placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* 2. قائمة المحادثات الحية */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2.5 custom-scrollbar">
        
        {/* 🌀 حالة التحميل المتوافقة بالكامل مع نظام الـ Skeleton الموحد لديك */}
        {isLoading ? (
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex items-center gap-4 p-3 rounded-2xl border theme-border bg-white/30 dark:bg-slate-900/20 animate-pulse">
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
          filteredChats.map((chat) => {
            const isCurrentlySelected = activeChatId === chat.id;

            return (
              <div
                key={chat.id}
                onClick={() => navigateToChat(chat)}
                className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer border shadow-sm transition-all duration-200 group relative overflow-hidden
                  bg-white/70 dark:bg-[#1e293b]/40 theme-border
                  ${isCurrentlySelected 
                    ? '!border-teal-500 ring-2 ring-teal-500/10 dark:bg-slate-900/60 shadow-md scale-[0.99]' 
                    : 'hover:bg-white dark:hover:bg-slate-900/20 hover:shadow-md hover:scale-[1.01]'
                  }`}
              >
                {/* الصورة الشخصية ونقطة الأونلاين */}
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

                  {/* نقطة الاتصال الحي */}
                  {chat.isActive && (
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                  )}
                </div>

                {/* تفاصيل الاسم والدور والمحتوى النصي */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm tracking-wide truncate ${isCurrentlySelected ? 'font-black text-teal-500' : 'font-bold theme-text'}`}>
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

                {/* التوقيت النسبي وعداد الرسائل غير المقروءة المعاصر */}
                <div className="flex flex-col items-end justify-between h-10 text-left flex-shrink-0">
                  <span className={`text-[10px] font-semibold ${isCurrentlySelected ? 'text-teal-500' : 'text-gray-400 dark:text-gray-500'}`}>
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
          })
        )}
      </div>
    </div>
  );
}