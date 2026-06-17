// import { motion as Motion, AnimatePresence } from "framer-motion";
// import { ArrowBack } from "@mui/icons-material";
// import { useDispatch } from "react-redux";
// import { clearSelectedPatient } from "../../../features/patients/patientsSlice";

// const formatDoctorName = (name = "") => {
//   const trimmedName = name.trim();
//   return trimmedName.startsWith("د.") ? trimmedName : `د. ${trimmedName}`;
// };

// const PatientRecordDetail = ({ patient, onBack }) => {
//   const dispatch = useDispatch();

//   const handleBack = () => {
//     dispatch(clearSelectedPatient());
//     onBack?.();
//   };

//   return (
//     <Motion.div
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: -20 }}
//       className="w-full"
//     >
//       {/* رأس الصفحة */}
//       <div className="sticky top-0 z-10 mb-6 -mx-3 px-3 py-4 backdrop-blur-md theme-surface-90 border-b theme-border">
//         <div className="max-w-4xl mx-auto flex items-center gap-3">
//           <button
//             onClick={handleBack}
//             className="p-2 rounded-xl theme-surface-80 theme-text hover:theme-surface-95 transition-colors"
//             aria-label="عودة للبحث"
//           >
//             <ArrowBack />
//           </button>
//           <div className="flex-1">
//             <h1 className="text-2xl font-bold theme-text">{patient.name}</h1>
//             <p className="text-sm theme-text-muted">📞 {patient.phone}</p>
//           </div>
//           <div className="text-right">
//             <p className="text-sm theme-text-muted">إجمالي الزيارات</p>
//             <p className="text-2xl font-bold theme-text">
//               {patient.visits?.length || 0}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* قائمة الزيارات */}
//       <div className="max-w-4xl mx-auto">
//         {patient.visits && patient.visits.length > 0 ? (
//           <AnimatePresence mode="popLayout">
//             {patient.visits.map((visit, idx) => (
//               <Motion.div
//                 key={idx}
//                 layout
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                 className="group relative mb-4 overflow-hidden rounded-3xl theme-surface-90 p-6 hover:shadow-lg transition-all duration-300"
//               >
//                 {/* خط ملون على الجانب الأيسر */}
//                 <div className="absolute right-0 top-0 w-1 h-full bg-linear-to-b from-green-500 via-blue-500 to-transparent"></div>

//                 {/* دائرة صغيرة */}
//                 <div className="absolute left-6 top-6 w-3 h-3 rounded-full bg-linear-to-br from-green-400 to-blue-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>

//                 <div className="pr-4">
//                   {/* رأس الزيارة */}
//                   <div className="mb-4 border-b theme-border pb-3">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-lg font-bold theme-text">
//                         {formatDoctorName(visit.doctor?.name)}
//                       </h3>
//                       <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
//                         {visit.visit_type === "check" ? "فحص جديد" : "متابعة"}
//                       </span>
//                     </div>
//                     <p className="text-sm theme-text-muted mb-1">
//                       {visit.doctor.specialization}
//                     </p>
//                     <p className="text-sm theme-text-muted">
//                       📍 {visit.doctor.clinic}
//                     </p>
//                   </div>

//                   {/* تفاصيل الزيارة */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     {/* التشخيص */}
//                     <div className="p-3 rounded-2xl theme-surface-80 border theme-border">
//                       <p className="text-xs font-semibold theme-text-muted mb-1">
//                         التشخيص
//                       </p>
//                       <p className="text-sm theme-text">{visit.diagnosis}</p>
//                     </div>

//                     {/* العلاج/الوصفة */}
//                     <div className="p-3 rounded-2xl theme-surface-80 border theme-border">
//                       <p className="text-xs font-semibold theme-text-muted mb-1">
//                         الوصفة الطبية
//                       </p>
//                       <p className="text-sm theme-text">{visit.prescription}</p>
//                     </div>
//                   </div>

//                   {/* معلومات إضافية */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
//                     <div className="p-3 rounded-2xl theme-surface-80 border theme-border">
//                       <p className="theme-text-muted mb-1">تاريخ الزيارة</p>
//                       <p className="theme-text font-semibold">
//                         {new Date(visit.visit_date).toLocaleDateString(
//                           "ar-SA",
//                           {
//                             weekday: "long",
//                             year: "numeric",
//                             month: "long",
//                             day: "numeric",
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           },
//                         )}
//                       </p>
//                     </div>

//                     <div className="p-3 rounded-2xl theme-surface-80 border theme-border">
//                       <p className="theme-text-muted mb-1">مصدر الحجز</p>
//                       <p className="theme-text font-semibold capitalize">
//                         {visit.booking_source === "patient"
//                           ? "حجز من المريض"
//                           : "حجز من الموظفة"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </Motion.div>
//             ))}
//           </AnimatePresence>
//         ) : (
//           <Motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center py-12"
//           >
//             <p className="theme-text-muted text-lg">لا توجد زيارات مسجلة</p>
//           </Motion.div>
//         )}
//       </div>
//     </Motion.div>
//   );
// };

// export default PatientRecordDetail;


import { motion as Motion, AnimatePresence } from "framer-motion";
import { ArrowBack } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { clearSelectedPatient } from "../../../features/patients/patientsSlice";
import { usePatientHistoryQuery } from "../../../services/patientsService"; // استيراد الهوك الجديد

const formatDoctorName = (name = "") => {
  const trimmedName = name.trim();
  return trimmedName.startsWith("د.") ? trimmedName : `د. ${trimmedName}`;
};

// دالة لمواءمة مصادر الحجز القادمة من السيرفر وعرضها بالعربية
const formatBookingSource = (source = "") => {
  const src = source.toLowerCase();
  if (src === "doctor") return "حجز من قبل الطبيب";
  if (src === "secretary") return "حجز من السكرتارية";
  if (src === "patient") return "حجز عبر المريض";
  return "حجز داخلي";
};

const PatientRecordDetail = ({ patient, onBack }) => {
  const dispatch = useDispatch();

  // 💡 استدعاء السجل الطبي للمريض من الـ API باستخدام الـ uuid
  const { data: historyResponse, isLoading } = usePatientHistoryQuery(patient.uuid);
  
  // استخراج البيانات بناءً على هيكلية الريسبونس المرفق
  const patientInfo = historyResponse?.data?.patient_info || patient;
  const visits = historyResponse?.data?.visits || [];

  const handleBack = () => {
    dispatch(clearSelectedPatient());
    onBack?.();
  };

  return (
    <Motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full "
    >
      {/* رأس الصفحة الثابت */}
      <div className="sticky top-0 z-10 mb-6 -mx-3 px-3 py-4 backdrop-blur-md theme-surface-90 border-b theme-border -mx-2 -my-4 sm:-mx-4 md:-mx-8 lg:-mx-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-xl theme-surface-80 theme-text hover:theme-surface-95 transition-colors"
            aria-label="عودة للبحث"
          >
            <ArrowBack />
          </button>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold theme-text">{patientInfo.name}</h1>
            <p className="text-sm theme-text-muted">📞 {patientInfo.phone}</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm theme-text-muted">إجمالي الزيارات</p>
            <p className="text-2xl font-bold theme-text">
              {isLoading ? "..." : visits.length}
            </p>
          </div>
        </div>
      </div>

      {/* منطقة عرض المحتوى والزيارات */}
      <div className="max-w-full mx-auto">
        {isLoading ? (
          // حالة جلب البيانات من السيرفر
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <CircularProgress size={40} color="inherit" className="theme-text-muted" />
            <p className="theme-text-muted text-sm animate-pulse">جاري جلب السجل الطبي للمريض...</p>
          </div>
        ) : visits.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {visits.map((visit, idx) => (
              <Motion.div
                key={visit.History_uuid || idx} // الاعتماد الأساسي على الـ History_uuid الفريد من الباك إند
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="group relative mb-4 overflow-hidden rounded-3xl theme-surface-90 p-6 border theme-border hover:shadow-lg transition-all duration-300"
              >
                {/* خط الديكور الجانبي والأيقونة الدائرية */}
                <div className="absolute right-0 top-0 w-1 h-full bg-linear-to-b from-purple-600 via-blue-500 to-transparent"></div>
                <div className="absolute left-6 top-6 w-3 h-3 rounded-full bg-linear-to-br from-purple-500 to-blue-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>

                <div className="pr-4">
                  {/* بيانات الطبيب والعيادة المعالجة */}
                  <div className="mb-4 border-b theme-border pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold theme-text">
                        {formatDoctorName(visit.doctor?.name)}
                      </h3>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        visit.visit_type === "check" 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      }`}>
                        {visit.visit_type === "check" ? "فحص جديد" : "مراجعة واستشارة"}
                      </span>
                    </div>
                    <p className="text-sm theme-text-muted mb-1">
                      التخصص: {visit.doctor?.specialization}
                    </p>
                    <p className="text-sm theme-text-muted">
                      📍 {visit.doctor?.clinic}
                    </p>
                  </div>


                  {/* بيانات وقت الزيارة وقناة الإدخال */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-2xl theme-surface-80 border theme-border">
                      <p className="theme-text-muted mb-1">تاريخ ووقت الزيارة</p>
                      <p className="theme-text font-semibold">
                        {new Date(visit.visit_date).toLocaleDateString("ar-SA", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl theme-surface-80 border theme-border">
                      <p className="theme-text-muted mb-1">مصدر تسجيل الحجز</p>
                      <p className="theme-text font-semibold">
                        {formatBookingSource(visit.booking_source)}
                      </p>
                    </div>
                  </div>
                </div>
              </Motion.div>
            ))}
          </AnimatePresence>
        ) : (
          // حالة عدم وجود زيارات سابقة
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 theme-surface-90 rounded-3xl border theme-border"
          >
            <p className="theme-text-muted text-base">لا توجد زيارات أو تقارير طبية مسجلة لهذا المريض حالياً.</p>
          </Motion.div>
        )}
      </div>
    </Motion.div>
  );
};

export default PatientRecordDetail;