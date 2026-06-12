

// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion as Motion } from "framer-motion";
// import Header from "./Header";
// import Sidebar from "./Sidebar";
// import { toggleDarkMode } from "../features/uiSlice";

// const Layout = ({ children }) => {
//   const { isCollapsed, darkMode } = useSelector((state) => state.ui);
//   const dispatch = useDispatch();
//   const isDark = darkMode;

//   const toggleTheme = () => {
//     dispatch(toggleDarkMode());
//   };

//   return (
//     /* 🎯 تحويل الحاوية الأبوية الكبرى لمنع السكرول الخارجي نهائياً وتثبيت الارتفاع بحجم الشاشة */
//     <div className="h-screen max-h-screen overflow-hidden theme-bg flex flex-col md:flex-row-reverse rtl font-['Almarai']">
      
//       {/* السايدبار الخاص بك */}
//       <Sidebar isDark={isDark} onToggleTheme={toggleTheme} />

//       {/* المحتوى الرئيسي يتوسع ديناميكياً حسب حالة السايدبار (للتاب واللابتوب) */}
//       <Motion.main
//         initial={false}
//         animate={{
//           marginRight: window.innerWidth >= 768 ? (isCollapsed ? 80 : 280) : 0,
//         }}
//         transition={{ type: "spring", stiffness: 300, damping: 30 }}
//         /* 🎯 جعل الـ main يأخذ الارتفاع الكامل الصارم ويتوزع عمودياً لمنع تمدد العناصر */
//         className="flex-1 min-w-0 h-full max-h-full flex flex-col overflow-hidden"
//       >
//         {/* الهيدر الرئيسي للموقع - ثابت ومستقر في الأعلى دائماً */}
//         <Header isDark={isDark} onToggleTheme={toggleTheme} />
        
//         {/* 🎯 حاوية الصفحات (children): تم منع السكرول العام منها (overflow-hidden) 
//             لكي لا تسحب صفحة الشات والابار لأعلى، وتترك الشات يعمل سكرول داخلي براحته */}
//         <div className="flex-1 min-h-0 w-full overflow-hidden p-0 m-0 relative">
//           {children}
//         </div>
//       </Motion.main>
//     </div>
//   );
// };

// export default Layout;







import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion as Motion } from "framer-motion";
import { useLocation } from "react-router-dom"; // 💡 استيراد لقراءة الرابط الحالي
import Header from "./Header";
import Sidebar from "./Sidebar";
import { toggleDarkMode } from "../features/uiSlice";

const Layout = ({ children }) => {
  const { isCollapsed, darkMode } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const isDark = darkMode;
  
  // 💡 فحص المسار الحالي للموقع
  const location = useLocation();
  
  // 🎯 شرط ذكي: إذا كان الرابط يحتوي على "conversations"، يتم قفل السكرول الخارجي تماماً.
  // في أي صفحة أخرى (schedule, patients, إلخ) يعود السكرول للعمل تلقائياً (overflow-y-auto).
  const isChatPage = location.pathname.includes("conversations");

  const toggleTheme = () => {
    dispatch(toggleDarkMode());
  };

  return (
    /* الحاوية الأبوية الكبرى ثابتة لمنع اهتزاز الشاشة */
    <div className="h-screen max-h-screen overflow-hidden theme-bg flex flex-col md:flex-row-reverse rtl font-['Almarai']">
      
      {/* السايدبار الخاص بك */}
      <Sidebar isDark={isDark} onToggleTheme={toggleTheme} />

      {/* المحتوى الرئيسي يتوسع ديناميكياً حسب حالة السايدبار */}
      <Motion.main
        initial={false}
        animate={{
          marginRight: window.innerWidth >= 768 ? (isCollapsed ? 80 : 280) : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex-1 min-w-0 h-full max-h-full flex flex-col overflow-hidden"
      >
        {/* الهيدر الرئيسي للموقع - ثابت ومستقر في الأعلى دائماً */}
        <Header isDark={isDark} onToggleTheme={toggleTheme} />
        
        {/* 🎯 التعديل السحري هنا:
            إذا كنا بصفحة الشات نطبق overflow-hidden لمنع ضياع الأشرطة.
            إذا كنا بأي صفحة أخرى نطبق overflow-y-auto ليعود السكرول كالمعتاد وتباعاً تظهر بقية البيانات لأسفل الطبيعي */}
        <div 
          className={`flex-1 min-h-0 w-full p-0 m-0 relative ${
            isChatPage ? "overflow-hidden" : "overflow-y-auto px-3 py-4 sm:px-4 md:px-8 lg:px-10"
          }`}
        >
          {children}
        </div>
      </Motion.main>
    </div>
  );
};

export default Layout;