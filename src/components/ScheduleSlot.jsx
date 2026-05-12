const ScheduleSlot = ({ doctor }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-400 text-blue-900",
    purple: "bg-purple-50 border-purple-400 text-purple-900",
    green: "bg-green-50 border-green-400 text-green-900",
  };

  return (
    <div className={`p-2 border-l-4 rounded-sm mb-1 ${colorClasses[doctor.color] || 'bg-gray-50'}`}>
      <p className="font-semibold text-xs leading-tight">{doctor.name}</p>
      <p className="text-[10px] opacity-80">{doctor.specialty} • {doctor.room}</p>
    </div>
  );
};

export default ScheduleSlot;