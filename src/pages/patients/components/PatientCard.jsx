// import { motion as Motion } from "framer-motion";
// import { useDispatch } from "react-redux";
// import { selectPatient } from "../../../features/patients/patientsSlice";

// const formatDoctorName = (name = "") => {
//   const trimmedName = name.trim();
//   return trimmedName.startsWith("د.") ? trimmedName : `د. ${trimmedName}`;
// };

// const PatientCard = ({ patient, onClick }) => {
//   const dispatch = useDispatch();


//   const handleCardClick = () => {
//     dispatch(selectPatient(patient));
//     onClick?.();
//   };

//   return (
//     <Motion.div
//       layout
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ type: "spring", stiffness: 300, damping: 30 }}
//       className="group relative mb-4 overflow-hidden rounded-3xl theme-surface-90 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
//       onClick={handleCardClick}
//     >
//       {/* خط أفقي على الجانب الأيسر */}
//       <div className="absolute right-0 top-0 w-1 h-full bg-linear-to-b from-blue-500 via-purple-500 to-transparent"></div>

//       {/* دائرة صغيرة زينة على الجانب الأيمن */}
//       <div className="absolute left-6 top-6 w-3 h-3 rounded-full bg-linear-to-br from-blue-400 to-purple-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>

//       <div className="pr-4">
//         {/* معلومات المريض الأساسية */}
//         <div className="mb-4 border-b theme-border pb-3">
//           <h3 className="text-lg font-bold theme-text mb-1">{patient.name}</h3>
//           <p className="text-sm theme-text-muted flex items-center gap-2">
//             <span>📞</span>
//             <span>{patient.phone}</span>
//           </p>
//         </div>

//         {/* معلومات الزيارات */}
//         <div className="space-y-3">
//           <p className="text-sm font-semibold theme-text-muted">
//             عدد الزيارات: {patient.visits?.length || 0}
//           </p>

//           {patient.visits && patient.visits.length > 0 && (
//             <div className="space-y-2">
//               {patient.visits.slice(0, 2).map((visit, idx) => (
//                 <div
//                   key={idx}
//                   className="text-xs theme-text-muted p-2 rounded-lg theme-surface-80 border theme-border"
//                 >
//                   <div className="flex justify-between items-center mb-1">
//                     <span className="font-semibold text-blue-600 dark:text-blue-400">
//                       {formatDoctorName(visit.doctor?.name)}
//                     </span>
//                     <span className="text-[10px] text-gray-500">
//                       {new Date(visit.visit_date).toLocaleDateString("ar-SA")}
//                     </span>
//                   </div>
//                   <p className="text-[11px]">
//                     <span className="theme-text-muted">التشخيص:</span>{" "}
//                     {visit.diagnosis}
//                   </p>
//                   <p className="text-[11px]">
//                     <span className="theme-text-muted">العلاج:</span>{" "}
//                     {visit.prescription}
//                   </p>
//                 </div>
//               ))}

//               {patient.visits.length > 2 && (
//                 <p className="text-xs text-blue-500 cursor-pointer hover:underline">
//                   +{patient.visits.length - 2} زيارات أخرى
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </Motion.div>
//   );
// };

// export default PatientCard;

import { motion as Motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { selectPatient } from "../../../features/patients/patientsSlice";

const formatDoctorName = (name = "") => {
  const trimmedName = name.trim();
  return trimmedName.startsWith("د.") ? trimmedName : `د. ${trimmedName}`;
};

const PatientCard = ({ patient, onClick }) => {
  const dispatch = useDispatch();

  const handleCardClick = () => {
    dispatch(selectPatient(patient));
    onClick?.();
  };

  return (
    <Motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="group relative mb-4 overflow-hidden rounded-3xl theme-surface-90 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      {/* خط تأثير جمالي متحرك على الجانب */}
      <div className="absolute right-0 top-0 w-1 h-full bg-linear-to-b from-blue-500 via-purple-500 to-transparent"></div>

      {/* دائرة زينة */}
      <div className="absolute left-6 top-6 w-3 h-3 rounded-full bg-linear-to-br from-blue-400 to-purple-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>

      <div className="pr-4">
        {/* معلومات المريض الأساسية */}
        <div className=" theme-border pb-3">
          <h3 className="text-lg font-bold theme-text mb-1">{patient.name}</h3>
          {patient.phone && (
            <p className="text-sm theme-text-muted flex items-center gap-2">
              <span>📞</span>
              <span>{patient.phone}</span>
            </p>
          )}
        </div>

        {/* معالجة وعرض معلومات الزيارات بشكل آمن وحذر */}
        <div className="">
          {/* <p className="text-sm font-semibold theme-text-muted">
            عدد الزيارات المسجلة: {patient.visits?.length || 0}
          </p> */}

          {patient.visits && patient.visits.length > 0 && (
            <div className="space-y-2">
              {patient.visits.slice(0, 2).map((visit, idx) => (
                <div
                  key={idx}
                  className="text-xs theme-text-muted p-2 rounded-lg theme-surface-80 border theme-border"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {formatDoctorName(visit.doctor?.name)}
                    </span>
                    {visit.visit_date && (
                      <span className="text-[10px] text-gray-500">
                        {new Date(visit.visit_date).toLocaleDateString("ar-SA")}
                      </span>
                    )}
                  </div>
                  {visit.diagnosis && (
                    <p className="text-[11px]">
                      <span className="theme-text-muted">التشخيص:</span> {visit.diagnosis}
                    </p>
                  )}
                  {visit.prescription && (
                    <p className="text-[11px]">
                      <span className="theme-text-muted">العلاج:</span> {visit.prescription}
                    </p>
                  )}
                </div>
              ))}

              {patient.visits.length > 2 && (
                <p className="text-xs text-blue-500 cursor-pointer hover:underline">
                  +{patient.visits.length - 2} زيارات أخرى
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Motion.div>
  );
};

export default PatientCard;