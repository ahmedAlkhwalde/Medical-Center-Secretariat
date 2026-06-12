

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // البديل لـ Get.toNamed في فلاتر
// import { Search, Users } from 'lucide-react'; // مكتبة الأيقونات المتوافقة مع مشروعك






// export default function ChatList({ isDark = true }) {
//   const navigate = useNavigate();

//   // --- 1. تعريف حالات الـ State ---
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeChatId, setActiveChatId] = useState("");
//   const [allChats, setAllChats] = useState([]);
//   const [filteredChats, setFilteredChats] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   // --- 2. محاكاة جلب البيانات من السيرفر ---
//   useEffect(() => {
//     setIsLoading(true);
    
//     const mockData = [
//       {
//         id: "1",
//         name: "د. سارة الأحمد",
//         role: "طبيبة مختبر",
//         lastMessage: "تم تحديث التقرير المخبري للمريض رقم...",
//         time: "12:45 م",
//         avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150",
//         unreadCount: 2,
//         isActive: true,
//       },
//       {
//         id: "2",
//         name: "أ. خالد منصور (إداري)",
//         role: "إدارة المشفى",
//         lastMessage: "يرجى مراجعة جدول العمليات للأسبوع القادم.",
//         time: "10:20 ص",
//         avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150",
//         unreadCount: 0,
//         isActive: false,
//       },
//       {
//         id: "3",
//         name: "فريق التمريض - الطوارئ",
//         role: "مجموعة",
//         lastMessage: "مريم: الحالة في الغرفة 5 مستقرة الآن.",
//         time: "أمس",
//         avatarUrl: "group_placeholder",
//         unreadCount: 0,
//         isActive: true,
//       },
//       {
//         id: "4",
//         name: "نور الهدى (سكرتارية)",
//         role: "استقبال",
//         lastMessage: "تم تأكيد موعد الاستشارة للمريض يوسف.",
//         time: "أمس",
//         avatarUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=150",
//         unreadCount: 0,
//         isActive: false,
//       },
//       {
//         id: "5",
//         name: "د. فهد المالكي",
//         role: "أخصائي أشعة",
//         lastMessage: "هل يمكنك مراجعة هذه الأشعة السينية؟",
//         time: "الجمعة",
//         avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=150",
//         unreadCount: 0,
//         isActive: false,
//       },
//     ];

//     setTimeout(() => {
//       setAllChats(mockData);
//       setFilteredChats(mockData);
//       setIsLoading(false);
//     }, 500); 
//   }, []);

//   // --- 3. منطق البحث والتصفية ---
//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     if (query.trim() === "") {
//       setFilteredChats(allChats);
//     } else {
//       const filtered = allChats.filter(
//         (chat) =>
//           chat.name.toLowerCase().includes(query.toLowerCase()) ||
//           chat.role.toLowerCase().includes(query.toLowerCase())
//       );
//       setFilteredChats(filtered);
//     }
//   };

//   // --- 4. منطق الضغط والانتقال للمحادثة ---
//   const navigateToChat = (chat) => {
//     setActiveChatId(chat.id);

//     const updatedChats = allChats.map((item) => {
//       if (item.id === chat.id) {
//         return { ...item, unreadCount: 0 }; 
//       }
//       return item;
//     });

//     setAllChats(updatedChats);
    
//     if (searchQuery.trim() === "") {
//       setFilteredChats(updatedChats);
//     } else {
//       setFilteredChats(
//         updatedChats.filter(
//           (item) =>
//             item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             item.role.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//       );
//     }

//     // 📝 التعديل هنا: دمج الـ chat.id في مسار الـ URL ليقرأه شريط المتصفح ديناميكياً
//     navigate(`/main-page/conversations/view/${chat.id}`, { // 👈 تمت الإضافة والتعديل هنا
//       state: {
//         chatId: chat.id,
//         chatName: chat.name,
//         avatarUrl: chat.avatarUrl,
//         role: chat.role,      
//         isActive: chat.isActive,
//       }
//     });
//   };

//   // --- 5. واجهة المستخدم ---
//   return (
//     <div 
//       dir="rtl" 
//       className={`w-full h-full flex flex-col font-['Cairo'] select-none
//         ${isDark ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'}`}
//     >
//       {/* 1. حقل البحث */}
//       <div className="p-4">
//         <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl shadow-sm border transition-all duration-200
//           ${isDark ? 'bg-[#1e293b] border-slate-700 focus-within:border-teal-500' : 'bg-white border-slate-200 focus-within:border-teal-500'}`}
//         >
//           <Search className="h-5 w-5 text-teal-500 min-w-[20px]" />
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => handleSearch(e.target.value)}
//             placeholder="بحث عن زميل..."
//             className="w-full bg-transparent outline-none text-sm font-medium placeholder-gray-400"
//           />
//         </div>
//       </div>

//       {/* 2. قائمة المحادثات */}
//       <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 custom-scrollbar">
//         {isLoading ? (
//           <div className="flex h-full items-center justify-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
//           </div>
//         ) : filteredChats.length === 0 ? (
//           <div className="flex h-full items-center justify-center text-sm text-gray-400">
//             <p>لا توجد محادثات مطابقة للبحث</p>
//           </div>
//         ) : (
//           filteredChats.map((chat) => {
//             const isCurrentlySelected = activeChatId === chat.id;

//             return (
//               <div
//                 key={chat.id}
//                 onClick={() => navigateToChat(chat)}
//                 className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer border transition-all duration-200 shadow-sm group
//                   ${isDark ? 'bg-[#1e293b]' : 'bg-white'}
//                   ${isCurrentlySelected 
//                     ? 'border-teal-500 ring-2 ring-teal-500/20' 
//                     : isDark ? 'border-slate-800 hover:border-slate-700' : 'border-slate-100 hover:border-slate-200'}`}
//               >
//                 {/* الصورة الشخصية ونقطة الأونلاين */}
//                 <div className="relative flex-shrink-0">
//                   {chat.avatarUrl === "group_placeholder" ? (
//                     <div className="h-14 w-14 rounded-full bg-teal-500/10 flex items-center justify-center">
//                       <Users className="h-7 w-7 text-teal-500" />
//                     </div>
//                   ) : (
//                     <img
//                       src={chat.avatarUrl}
//                       alt={chat.name}
//                       className="h-14 w-14 rounded-full object-cover border border-slate-200/10"
//                     />
//                   )}

//                   {chat.isActive && (
//                     <span className={`absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 ring-2 
//                       ${isDark ? 'ring-[#1e293b]' : 'ring-white'}`} 
//                     />
//                   )}
//                 </div>

//                 {/* تفاصيل الاسم والدور */}
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-1">
//                     <h3 className="font-bold text-sm truncate">{chat.name}</h3>
//                     <span className={`text-[11px] font-semibold tracking-wide truncate
//                       ${isCurrentlySelected ? 'text-teal-500' : 'text-gray-400'}`}
//                     >
//                       ({chat.role})
//                     </span>
//                   </div>
//                   <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
//                     {chat.lastMessage}
//                   </p>
//                 </div>

//                 {/* الوقت والإشعارات */}
//                 <div className="flex flex-col items-end justify-between h-11 text-left flex-shrink-0">
//                   <span className={`text-[10px] ${isCurrentlySelected ? 'text-teal-500' : 'text-gray-400'}`}>
//                     {chat.time}
//                   </span>
                  
//                   {chat.unreadCount > 0 ? (
//                     <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-teal-500 px-1 text-[10px] font-bold text-white">
//                       {chat.unreadCount}
//                     </span>
//                   ) : (
//                     <div className="h-5 w-5" />
//                   )}
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }












import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Search, Users } from 'lucide-react'; 
import chatService from "../../app/services/chatService";

export default function ChatList({ isDark = true }) {
  const navigate = useNavigate();

  // --- 1. تعريف حالات الـ State المحلية ---
  const [activeChatId, setActiveChatId] = useState("");
  const [allChats, setAllChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState(""); // 🎯 لتخزين الـ ID الخاص بالطبيب الحالي

  // --- 2. ربط السيرفر باستخدام TanStack Query ---
  const { data: responseMap, isLoading } = chatService.useGetPotentialContacts();

  // مزامنة البيانات القادمة من السيرفر مع الـ States المحلية عند اكتمال الجلب
  useEffect(() => {
    if (responseMap) {
      // 🎯 التقاط معرّف الطبيب الحالي الحقيقي (مثل id: 7) مطابق لدالة الفلاتر
      if (responseMap.current_user) {
        setCurrentUserId(String(responseMap.current_user.id));
        console.log(`✅ تم التقاط ID الطبيب الحالي من السيرفر: ${responseMap.current_user.id}`);
      }

      const rawData = responseMap.data || [];
      setAllChats(rawData);
      
      // إذا لم يكن المستخدم يكتب في حقل البحث، نحدث القائمة المفلترة بالبيانات الجديدة
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

  // --- 4. منطق الضغط والانتقال للمحادثة (مطابق تماماً لمنطق فلاتر) ---
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

    // 📝 الانتقال وتمرير المعرفات الحقيقية والديناميكية بالكامل (البديل لـ Get.toNamed)
    navigate(`/main-page/conversations/view/${chat.id}`, { 
      state: {
        chatId: chat.id,          // targetId
        currentUserId: currentUserId, // يمرر المعرف المأخوذ من السيرفر تلقائياً (مثل "7")
        chatName: chat.name,
        avatarUrl: chat.avatarUrl,
        role: chat.role,      
        isActive: chat.isActive,
      }
    });
  };

  // --- 5. واجهة المستخدم (نفس التصميم والألوان الخاصة بك دون تغيير شعرة واحدة) ---
  return (
    <div 
      dir="rtl" 
      className={`w-full h-full flex flex-col font-['Cairo'] select-none
        ${isDark ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'}`}
    >
      {/* 1. حقل البحث */}
      <div className="p-4">
        <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl shadow-sm border transition-all duration-200
          ${isDark ? 'bg-[#1e293b] border-slate-700 focus-within:border-teal-500' : 'bg-white border-slate-200 focus-within:border-teal-500'}`}
        >
          <Search className="h-5 w-5 text-teal-500 min-w-[20px]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="بحث عن زميل..."
            className="w-full bg-transparent outline-none text-sm font-medium placeholder-gray-400"
          />
        </div>
      </div>

      {/* 2. قائمة المحادثات الحية */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 custom-scrollbar">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            <p>لا توجد محادثات مطابقة للبحث</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isCurrentlySelected = activeChatId === chat.id;

            return (
              <div
                key={chat.id}
                onClick={() => navigateToChat(chat)}
                className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer border transition-all duration-200 shadow-sm group
                  ${isDark ? 'bg-[#1e293b]' : 'bg-white'}
                  ${isCurrentlySelected 
                    ? 'border-teal-500 ring-2 ring-teal-500/20' 
                    : isDark ? 'border-slate-800 hover:border-slate-700' : 'border-slate-100 hover:border-slate-200'}`}
              >
                {/* الصورة الشخصية ونقطة الأونلاين */}
                <div className="relative flex-shrink-0">
                  {chat.avatarUrl === "group_placeholder" || !chat.avatarUrl ? (
                    <div className="h-14 w-14 rounded-full bg-teal-500/10 flex items-center justify-center">
                      <Users className="h-7 w-7 text-teal-500" />
                    </div>
                  ) : (
                    <img
                      src={chat.avatarUrl}
                      alt={chat.name}
                      className="h-14 w-14 rounded-full object-cover border border-slate-200/10"
                    />
                  )}

                  {chat.isActive && (
                    <span className={`absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 ring-2 
                      ${isDark ? 'ring-[#1e293b]' : 'ring-white'}`} 
                    />
                  )}
                </div>

                {/* تفاصيل الاسم والدور */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm truncate">{chat.name}</h3>
                    <span className={`text-[11px] font-semibold tracking-wide truncate
                      ${isCurrentlySelected ? 'text-teal-500' : 'text-gray-400'}`}
                    >
                      ({chat.role})
                    </span>
                  </div>
                  <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {chat.lastMessage}
                  </p>
                </div>

                {/* الوقت والإشعارات */}
                <div className="flex flex-col items-end justify-between h-11 text-left flex-shrink-0">
                  <span className={`text-[10px] ${isCurrentlySelected ? 'text-teal-500' : 'text-gray-400'}`}>
                    {chat.time}
                  </span>
                  
                  {chat.unreadCount > 0 ? (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-teal-500 px-1 text-[10px] font-bold text-white">
                      {chat.unreadCount}
                    </span>
                  ) : (
                    <div className="h-5 w-5" />
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