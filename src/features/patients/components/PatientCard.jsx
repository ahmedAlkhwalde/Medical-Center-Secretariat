import { motion as Motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { selectPatient } from "../store/patientsSlice";

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
        <div className=" theme-border">
          <h3 className="text-lg font-bold theme-text">{patient.name}</h3>
        </div>
      </div>
    </Motion.div>
  );
};

export default PatientCard;