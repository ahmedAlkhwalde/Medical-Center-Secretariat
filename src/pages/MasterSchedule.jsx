// import React, { useState, useMemo, useRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { 
//   addPatient, 
//   addAppointment, 
//   deleteAppointment,
//   setSpecialty,
//   setDoctorFilter,
//   setSearchQuery,
//   updatePaymentStatus
// } from '../store/scheduleSlice';

// // --- BookingModal Component ---
// const BookingModal = ({ doctor, onClose }) => {
//   const dispatch = useDispatch();
//   const scrollRef = useRef(null);
//   const { patients, appointments } = useSelector(state => state.schedule);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [newPatient, setNewPatient] = useState({ name: '', phone: '', dob: '', gender: 'Male' });

//   const getFormattedDate = (dayName) => {
//     const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     const now = new Date();
//     const currentDayIndex = now.getDay();
//     const targetDayIndex = days.indexOf(dayName);
//     const diff = targetDayIndex - currentDayIndex;
//     const targetDate = new Date(now);
//     targetDate.setDate(now.getDate() + diff);
//     return targetDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     if (!scrollRef.current) return;
//     const container = scrollRef.current;
//     const { top, bottom } = container.getBoundingClientRect();
//     if (e.clientY < top + 80) container.scrollTop -= 20;
//     else if (e.clientY > bottom - 80) container.scrollTop += 20;
//   };

//   const slots = useMemo(() => {
//     if (!doctor?.time) return [];
//     const timeSlots = [];
//     let [hours, minutes] = doctor.time.split(':').map(Number);
//     for (let i = 0; i < 4; i++) {
//       timeSlots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
//       minutes += 15;
//       if (minutes >= 60) { hours++; minutes = 0; }
//     }
//     return timeSlots;
//   }, [doctor]);

//   const handleDrop = (e, targetSlot) => {
//     e.preventDefault();
//     const targetBooking = appointments.find(a => a.doctorId === doctor.id && a.timeSlot === targetSlot);
//     if (targetBooking?.isPaid) return;
//     const patientData = e.dataTransfer.getData("patient");
//     const moveData = e.dataTransfer.getData("moveAppointment");
//     const actualDate = getFormattedDate(doctor.day);
//     const fullBookingDate = `${doctor.day} (${actualDate})`;

//     if (patientData) {
//       const p = JSON.parse(patientData);
//       dispatch(addAppointment({ 
//         doctorId: doctor.id, patientId: p.id, timeSlot: targetSlot, 
//         patientName: p.name, phone: p.phone, bookingDate: fullBookingDate, 
//         gender: p.gender, isPaid: false 
//       }));
//     } else if (moveData) {
//       const { fromSlot, patient } = JSON.parse(moveData);
//       if (fromSlot === targetSlot) return;
//       dispatch(deleteAppointment({ doctorId: doctor.id, timeSlot: fromSlot }));
//       dispatch(addAppointment({ ...patient, timeSlot: targetSlot, bookingDate: fullBookingDate }));
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
//       <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl flex h-[85vh] overflow-hidden border border-white/20">
//         <div className="w-85 border-r border-slate-100 bg-slate-50/50 p-8 flex flex-col">
//           <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tighter">
//             <span className="material-symbols-outlined text-teal-600">person_add</span> Patients Registry
//           </h3>
//           <input 
//             type="text" placeholder="Search by name..." 
//             className="w-full px-5 py-3 rounded-2xl border-none shadow-inner bg-white text-sm mb-6 outline-none"
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2">
//             {patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
//               <div 
//                 key={p.id} draggable 
//                 onDragStart={(e) => e.dataTransfer.setData("patient", JSON.stringify(p))}
//                 className="p-4 bg-white border-2 border-slate-100 rounded-[1.5rem] cursor-grab hover:border-teal-400 hover:shadow-lg transition-all group"
//               >
//                 <div className="font-black text-slate-800 text-sm group-hover:text-teal-700">{p.name}</div>
//                 <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400 font-bold">
//                   <span>{p.phone}</span>
//                   <span className="uppercase bg-slate-50 px-2 py-0.5 rounded-md">{p.gender}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="bg-[#0f172a] rounded-[2rem] p-6 text-white shadow-2xl">
//             <p className="text-[10px] font-black mb-4 opacity-50 tracking-widest uppercase text-center">New Profile Registration</p>
//             <div className="space-y-3">
//               <input type="text" placeholder="Full Name" className="w-full p-3 bg-white/5 rounded-xl text-sm border-none outline-none focus:ring-1 focus:ring-teal-400" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} />
//               <input type="text" placeholder="Phone Number" className="w-full p-3 bg-white/5 rounded-xl text-sm border-none outline-none focus:ring-1 focus:ring-teal-400" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} />
//               <div className="grid grid-cols-2 gap-2">
//                 <input type="date" className="w-full p-3 bg-white/5 rounded-xl text-[11px] border-none text-slate-400" value={newPatient.dob} onChange={e => setNewPatient({...newPatient, dob: e.target.value})} />
//                 <select className="w-full p-3 bg-white/5 rounded-xl text-[11px] border-none text-slate-400 outline-none" value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value})}>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                 </select>
//               </div>
//               <button 
//                 onClick={() => {
//                   if(newPatient.name && newPatient.phone) {
//                     dispatch(addPatient({...newPatient, id: Date.now()}));
//                     setNewPatient({ name: '', phone: '', dob: '', gender: 'Male' });
//                   }
//                 }}
//                 className="w-full py-3 bg-teal-400 text-teal-950 font-black rounded-xl text-sm hover:bg-white transition-all transform active:scale-95 shadow-lg shadow-teal-500/20"
//               >
//                 Register
//               </button>
//             </div>
//           </div>
//         </div>

//         <div ref={scrollRef} onDragOver={handleDragOver} className="flex-1 p-10 overflow-y-auto relative bg-white scroll-smooth">
//           <button onClick={onClose} className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-all transform hover:rotate-90">
//             <span className="material-symbols-outlined text-4xl">cancel</span>
//           </button>
//           <div className="mb-10">
//             <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{doctor.name}</h2>
//             <p className="text-slate-400 font-bold text-sm uppercase mt-2 tracking-[0.3em] flex items-center gap-2">
//               <span className="material-symbols-outlined text-teal-500">calendar_month</span> {doctor.specialty} • {doctor.day} Current Week
//             </p>
//           </div>
//           <div className="grid gap-5">
//             {slots.map(slot => {
//               const booking = appointments.find(a => a.doctorId === doctor.id && a.timeSlot === slot);
//               const isPaid = !!booking?.isPaid;
//               return (
//                 <div 
//                   key={slot} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, slot)}
//                   draggable={booking && !isPaid} onDragStart={(e) => e.dataTransfer.setData("moveAppointment", JSON.stringify({ fromSlot: slot, patient: booking }))}
//                   className={`relative p-8 rounded-[2.5rem] border-[3px] transition-all flex items-center justify-between ${booking ? (isPaid ? 'border-teal-500 bg-teal-50/30' : 'border-slate-500 bg-white shadow-2xl shadow-slate-200 ring-8 ring-slate-50/50') : 'border-dashed border-slate-100 bg-slate-50/20'}`}
//                 >
//                   <div className="flex items-center gap-10">
//                     <div className={`text-3xl font-black italic ${isPaid ? 'text-teal-600' : (booking ? 'text-slate-900' : 'text-slate-100')}`}>{slot}</div>
//                     {booking ? (
//                       <div className="flex flex-col gap-1">
//                         <div className="flex items-center gap-3">
//                           <span className="text-2xl font-black text-slate-900 leading-none">{booking.patientName}</span>
//                           <span className={`text-[9px] px-2 py-0.5 rounded-full font-black text-white shadow-sm ${booking.gender === 'Female' ? 'bg-pink-500' : 'bg-blue-500'}`}>{booking.gender}</span>
//                         </div>
//                         <div className="flex items-center gap-5 text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
//                            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px] text-teal-500">call</span> {booking.phone}</span>
//                            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px] text-teal-500">event_available</span> Booking: {booking.bookingDate}</span>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-slate-200 font-bold text-sm uppercase tracking-[0.2em]">Ready for Booking</div>
//                     )}
//                   </div>
//                   {booking && (
//                     <div className="flex items-center gap-3">
//                       <button 
//                         onClick={() => dispatch(updatePaymentStatus({ doctorId: doctor.id, timeSlot: slot }))}
//                         className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase transition-all shadow-lg ${isPaid ? 'bg-teal-600 text-white shadow-teal-200' : 'bg-white border-2 border-slate-200 text-slate-400 hover:border-teal-500 hover:text-teal-600'}`}
//                       >
//                         <span className="material-symbols-outlined">{isPaid ? 'verified' : 'payments'}</span>
//                         {isPaid ? 'Paid' : 'Checkout'}
//                       </button>
//                       {!isPaid && (
//                         <button onClick={() => dispatch(deleteAppointment({ doctorId: doctor.id, timeSlot: slot }))} className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
//                           <span className="material-symbols-outlined text-2xl">delete_forever</span>
//                         </button>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Main MasterSchedule Component ---
// const MasterSchedule = () => {
//   const dispatch = useDispatch();
//   const { doctorsSchedule, selectedSpecialty, selectedDoctorId, searchQuery } = useSelector((state) => state.schedule);
//   const [activeDoctor, setActiveDoctor] = useState(null);
//   const [selectedYear, setSelectedYear] = useState(2026);
//   const [selectedMonth, setSelectedMonth] = useState('May');
//   const [selectedWeek, setSelectedWeek] = useState(0);

//   const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//   const years = [2024, 2025, 2026, 2027];

//   const { weeksInMonth, currentWeekDays } = useMemo(() => {
//     const monthIndex = months.indexOf(selectedMonth);
//     const lastDayOfMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
//     const weeks = [];
//     for (let i = 0; i < lastDayOfMonth; i += 7) weeks.push(i);
//     const startNum = (selectedWeek * 7) + 1;
//     const daysLabels = ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'];
//     const days = daysLabels.map((d, index) => {
//       const dayNumber = startNum + index;
//       return { short: d, num: dayNumber <= lastDayOfMonth ? dayNumber : null };
//     });
//     return { weeksInMonth: weeks, currentWeekDays: days };
//   }, [selectedYear, selectedMonth, selectedWeek]);

//   // الفلترة المحسنة
//   const filteredSchedule = useMemo(() => {
//     return doctorsSchedule.filter(doc => {
//       const matchSpec = selectedSpecialty === 'All Specialties' || doc.specialty === selectedSpecialty;
//       const matchDoc = selectedDoctorId === 'All Doctors' || doc.id.toString() === selectedDoctorId;
//       const matchSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
//       return matchSpec && matchDoc && matchSearch;
//     });
//   }, [doctorsSchedule, selectedSpecialty, selectedDoctorId, searchQuery]);

//   return (
//     <div className="flex bg-[#f8fafc] min-h-screen font-sans overflow-hidden">
//       <aside className="w-60 bg-white border-r border-slate-100 flex flex-col fixed h-full z-10 shadow-sm">
//         <div className="p-5 flex items-center gap-2 text-teal-600 font-bold text-lg">
//           <span className="material-symbols-outlined">medical_services</span> ClinicConnect
//         </div>
//         <nav className="mt-2 px-4 space-y-1 flex-1">
//           {[{n:'Dashboard', i:'grid_view'}, {n:'Schedule', i:'calendar_month'}, {n:'Patients', i:'person'}, {n:'Registrations', i:'clinical_notes'}, {n:'Settings', i:'settings'}].map(item => (
//             <button key={item.n} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${item.n === 'Schedule' ? 'bg-[#e6f4f1] text-teal-700 font-bold' : 'text-slate-400 hover:bg-slate-50'}`}>
//               <span className="material-symbols-outlined text-xl">{item.i}</span> {item.n}
//             </button>
//           ))}
//         </nav>
//         <div className="p-4 border-t border-slate-50">
//           <button className="w-full py-2.5 bg-white border border-red-100 text-red-500 rounded-xl font-bold text-[10px] flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
//             <span className="material-symbols-outlined text-sm font-bold">emergency</span> Emergency Entry
//           </button>
//         </div>
//       </aside>

//       <main className="ml-60 flex-1 px-8 pt-12">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center justify-between mb-4">
//              <div className="relative w-64">
//                 <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-base">search</span>
//                 <input 
//                   type="text" placeholder="Search for doctors..." 
//                   className="w-full pl-9 pr-4 py-2 bg-white border-none shadow-sm rounded-xl text-xs focus:ring-2 focus:ring-teal-500/20 outline-none"
//                   value={searchQuery}
//                   onChange={(e) => dispatch(setSearchQuery(e.target.value))}
//                 />
//              </div>
//           </div>

//           <div className="flex justify-between items-end mb-6">
//             <div>
//               <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">Weekly Master Schedule</h1>
//               <p className="text-slate-400 text-xs font-bold mt-1 tracking-wide uppercase">Department Management • {selectedMonth} {selectedYear}</p>
//             </div>

//             <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-50">
//               {/* ربط قيمة الطبيب بالـ state */}
//               <select value={selectedDoctorId} onChange={(e) => dispatch(setDoctorFilter(e.target.value))} className="text-[10px] font-black text-slate-500 bg-slate-50 border-none rounded-lg p-2 outline-none cursor-pointer">
//                 <option value="All Doctors">All Doctors</option>
//                 {/* استخراج الأطباء بشكل فريد */}
//                 {Array.from(new Set(doctorsSchedule.map(d => d.name))).map(name => {
//                   const doc = doctorsSchedule.find(d => d.name === name);
//                   return <option key={doc.id} value={doc.id}>{doc.name}</option>;
//                 })}
//               </select>
              
//               <div className="h-5 w-px bg-slate-100"></div>

//               <select value={selectedYear} onChange={(e) => {setSelectedYear(Number(e.target.value)); setSelectedWeek(0);}} className="text-[10px] font-black text-slate-500 bg-slate-50 border-none rounded-lg p-2 outline-none cursor-pointer">
//                 {years.map(y => <option key={y} value={y}>{y}</option>)}
//               </select>

//               <select value={selectedMonth} onChange={(e) => {setSelectedMonth(e.target.value); setSelectedWeek(0);}} className="text-[10px] font-black text-slate-500 bg-slate-50 border-none rounded-lg p-2 outline-none cursor-pointer">
//                 {months.map(m => <option key={m} value={m}>{m.slice(0,3)}</option>)}
//               </select>

//               <div className="flex bg-slate-100 p-1 rounded-xl">
//                 {weeksInMonth.map((_, idx) => (
//                   <button key={idx} onClick={() => setSelectedWeek(idx)} className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${selectedWeek === idx ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>W{idx + 1}</button>
//                 ))}
//               </div>

//               <div className="h-5 w-px bg-slate-100"></div>

//               {/* ربط قيمة التخصص بالـ state */}
//               <select value={selectedSpecialty} onChange={(e) => dispatch(setSpecialty(e.target.value))} className="text-[10px] font-black text-teal-800 bg-[#e0f2f1] border-none rounded-lg p-2 outline-none cursor-pointer">
//                 <option value="All Specialties">All Specialties</option>
//                 <option value="Surgery">Surgery</option>
//                 <option value="Internal Medicine">Internal Medicine</option>
//                 <option value="Pediatrics">Pediatrics</option>
//               </select>
//             </div>
//           </div>

//           <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-2xl shadow-slate-200/40 overflow-hidden">
//             <div className="grid grid-cols-[80px_repeat(7,1fr)] bg-slate-50/50 border-b border-slate-100">
//               <div className="flex items-center justify-center border-r border-slate-100 py-6">
//                 <span className="material-symbols-outlined text-slate-200">schedule</span>
//               </div>
//               {currentWeekDays.map((day, idx) => (
//                 <div key={idx} className={`text-center py-6 border-r border-slate-100 last:border-0 ${!day.num ? 'opacity-20' : ''}`}>
//                   <div className="text-[10px] font-black text-teal-600/40 uppercase mb-1 tracking-tighter">{day.short}</div>
//                   <div className="text-2xl font-black text-slate-800">{day.num || '-'}</div>
//                 </div>
//               ))}
//             </div>

//             <div className="h-[58vh] overflow-y-auto scrollbar-hide">
//               {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '20:00'].map(time => (
//                 <div key={time} className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-slate-50 min-h-[140px]">
//                   <div className="flex items-start justify-center pt-8 border-r border-slate-100 text-xs font-black text-slate-200 italic">{time}</div>
//                   {currentWeekDays.map((day, idx) => (
//                     <div key={idx} className="p-3 border-r border-slate-50 last:border-0 relative hover:bg-slate-50/30 transition-all">
//                       {day.num && filteredSchedule
//                         .filter(d => d.day === day.short && d.time === time)
//                         .map(doctor => (
//                           <div 
//                             key={doctor.id} onClick={() => setActiveDoctor(doctor)}
//                             className={`p-4 rounded-2xl border-l-4 shadow-sm cursor-pointer hover:scale-[1.02] transition-transform mb-2 bg-${doctor.color}-50 border-${doctor.color}-500 shadow-${doctor.color}-100`}
//                           >
//                             <div className={`text-[11px] font-black text-${doctor.color}-700 leading-tight`}>{doctor.name}</div>
//                             <div className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{doctor.specialty} • {doctor.room}</div>
//                           </div>
//                         ))
//                       }
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>

//       {activeDoctor && <BookingModal doctor={activeDoctor} onClose={() => setActiveDoctor(null)} />}
//     </div>
//   );
// };

// export default MasterSchedule;










import React, { useState, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// --- استيراد أيقونات MUI التي طلبتها ---
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SettingsIcon from '@mui/icons-material/Settings';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CallIcon from '@mui/icons-material/Call';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import VerifiedIcon from '@mui/icons-material/Verified';
import PaymentsIcon from '@mui/icons-material/Payments';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import MoreTimeIcon from '@mui/icons-material/MoreTime';

import { 
  addPatient, 
  addAppointment, 
  deleteAppointment,
  setSpecialty,
  setDoctorFilter,
  setSearchQuery,
  updatePaymentStatus
} from '../store/scheduleSlice';

// --- BookingModal Component ---
const BookingModal = ({ doctor, onClose }) => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const { patients, appointments } = useSelector(state => state.schedule);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPatient, setNewPatient] = useState({ name: '', phone: '', dob: '', gender: 'Male' });

  const getFormattedDate = (dayName) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const currentDayIndex = now.getDay();
    const targetDayIndex = days.indexOf(dayName);
    const diff = targetDayIndex - currentDayIndex;
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + diff);
    return targetDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const { top, bottom } = container.getBoundingClientRect();
    if (e.clientY < top + 80) container.scrollTop -= 20;
    else if (e.clientY > bottom - 80) container.scrollTop += 20;
  };

  const slots = useMemo(() => {
    if (!doctor?.time) return [];
    const timeSlots = [];
    let [hours, minutes] = doctor.time.split(':').map(Number);
    for (let i = 0; i < 10; i++) {
      timeSlots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      minutes += 15;
      if (minutes >= 60) { hours++; minutes = 0; }
    }
    return timeSlots;
  }, [doctor]);

  const handleDrop = (e, targetSlot) => {
    e.preventDefault();
    const targetBooking = appointments.find(a => a.doctorId === doctor.id && a.timeSlot === targetSlot);
    if (targetBooking?.isPaid) return;
    const patientData = e.dataTransfer.getData("patient");
    const moveData = e.dataTransfer.getData("moveAppointment");
    const actualDate = getFormattedDate(doctor.day);
    const fullBookingDate = `${doctor.day} (${actualDate})`;

    if (patientData) {
      const p = JSON.parse(patientData);
      dispatch(addAppointment({ 
        doctorId: doctor.id, patientId: p.id, timeSlot: targetSlot, 
        patientName: p.name, phone: p.phone, bookingDate: fullBookingDate, 
        gender: p.gender, isPaid: false 
      }));
    } else if (moveData) {
      const { fromSlot, patient } = JSON.parse(moveData);
      if (fromSlot === targetSlot) return;
      dispatch(deleteAppointment({ doctorId: doctor.id, timeSlot: fromSlot }));
      dispatch(addAppointment({ ...patient, timeSlot: targetSlot, bookingDate: fullBookingDate }));
    }
  };

  return (
    <div className="fixed inset-0 theme-overlay backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="theme-surface w-full max-w-6xl rounded-[3rem] shadow-2xl flex h-[85vh] overflow-hidden border theme-border">
        <div className="w-85 border-r theme-border theme-bg p-8 flex flex-col">
          <h3 className="text-xl font-black theme-text mb-6 flex items-center gap-2 uppercase tracking-tighter">
            <PersonAddIcon className="theme-text-accent" /> Patients Registry
          </h3>
          <input 
            type="text" placeholder="Search by name..." 
            className="w-full px-5 py-3 rounded-2xl border-none shadow-inner theme-surface theme-text text-sm mb-6 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2 no-scrollbar">
            {patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
              <div 
                key={p.id} draggable 
                onDragStart={(e) => e.dataTransfer.setData("patient", JSON.stringify(p))}
                className="p-4 theme-surface border-2 theme-border rounded-[1.5rem] cursor-grab theme-hover-surface transition-all group"
              >
                <div className="font-black theme-text text-sm group-hover:theme-text-accent">{p.name}</div>
                <div className="flex justify-between items-center mt-1 text-[10px] theme-text-muted font-bold">
                  <span>{p.phone}</span>
                  <span className="uppercase theme-bg px-2 py-0.5 rounded-md">{p.gender}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="theme-accent-strong rounded-[2rem] p-6 theme-text-on-accent shadow-2xl">
            <p className="text-[10px] font-black mb-4 opacity-70 tracking-widest uppercase text-center">New Profile Registration</p>
            <div className="space-y-3">
              <input type="text" placeholder="Full Name" className="w-full p-3 bg-white/10 rounded-xl text-sm border-none outline-none placeholder:text-white/50" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} />
              <input type="text" placeholder="Phone Number" className="w-full p-3 bg-white/10 rounded-xl text-sm border-none outline-none placeholder:text-white/50" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} />
              <div className="grid grid-cols-2 gap-2">
                <input type="date" className="w-full p-3 bg-white/10 rounded-xl text-[11px] border-none text-white/70" value={newPatient.dob} onChange={e => setNewPatient({...newPatient, dob: e.target.value})} />
                <select className="w-full p-3 bg-white/10 rounded-xl text-[11px] border-none text-white/70 outline-none" value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value})}>
                  <option value="Male" className="text-black">Male</option>
                  <option value="Female" className="text-black">Female</option>
                </select>
              </div>
              <button 
                onClick={() => {
                  if(newPatient.name && newPatient.phone) {
                    dispatch(addPatient({...newPatient, id: Date.now()}));
                    setNewPatient({ name: '', phone: '', dob: '', gender: 'Male' });
                  }
                }}
                className="w-full py-3 theme-surface theme-text-accent font-black rounded-xl text-sm hover:opacity-90 transition-all transform active:scale-95 shadow-lg"
              >
                Register
              </button>
            </div>
          </div>
        </div>

        <div ref={scrollRef} onDragOver={handleDragOver} className="flex-1 p-10 overflow-y-auto relative theme-surface scroll-smooth">
          <button onClick={onClose} className="absolute top-8 right-8 theme-text-muted theme-hover-text-accent transition-all flex flex-col items-center">
            <CancelIcon sx={{ fontSize: 40 }} />
            <span className="text-[10px] font-bold uppercase mt-1">Close</span>
          </button>
          
          <div className="mb-10">
            <h2 className="text-5xl font-black theme-text tracking-tighter">{doctor.name}</h2>
            <p className="theme-text-muted font-bold text-sm uppercase mt-2 tracking-[0.3em] flex items-center gap-2">
              <CalendarMonthIcon className="theme-text-accent" sx={{ fontSize: 18 }} /> {doctor.specialty} • {doctor.day} Current Week
            </p>
          </div>
          <div className="grid gap-5">
            {slots.map(slot => {
              const booking = appointments.find(a => a.doctorId === doctor.id && a.timeSlot === slot);
              const isPaid = !!booking?.isPaid;
              return (
                <div 
                  key={slot} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, slot)}
                  draggable={booking && !isPaid} onDragStart={(e) => e.dataTransfer.setData("moveAppointment", JSON.stringify({ fromSlot: slot, patient: booking }))}
                  className={`relative p-8 rounded-[2.5rem] border-[3px] transition-all flex items-center justify-between ${booking ? (isPaid ? 'theme-border theme-accent-soft' : 'theme-border theme-surface shadow-2xl ring-8 theme-bg') : 'border-dashed theme-border theme-bg/20'}`}
                >
                  <div className="flex items-center gap-10">
                    <div className={`text-3xl font-black italic ${isPaid ? 'theme-text-accent' : (booking ? 'theme-text' : 'opacity-20 theme-text')}`}>{slot}</div>
                    {booking ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-black theme-text leading-none">{booking.patientName}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-black text-white shadow-sm ${booking.gender === 'Female' ? 'bg-pink-500' : 'bg-blue-500'}`}>{booking.gender}</span>
                        </div>
                        <div className="flex items-center gap-5 text-xs font-bold theme-text-muted uppercase tracking-widest mt-1">
                           <span className="flex items-center gap-1.5"><CallIcon className="theme-text-accent" sx={{ fontSize: 16 }} /> {booking.phone}</span>
                           <span className="flex items-center gap-1.5"><EventAvailableIcon className="theme-text-accent" sx={{ fontSize: 16 }} /> Booking: {booking.bookingDate}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="theme-text-muted opacity-30 font-bold text-sm uppercase tracking-[0.2em]">Ready for Booking</div>
                    )}
                  </div>
                  {booking && (
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => dispatch(updatePaymentStatus({ doctorId: doctor.id, timeSlot: slot }))}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase transition-all shadow-lg ${isPaid ? 'theme-accent theme-text-on-accent' : 'theme-surface border-2 theme-border theme-text-muted theme-hover-accent theme-hover-text-accent'}`}
                      >
                        {isPaid ? <VerifiedIcon sx={{ fontSize: 18 }} /> : <PaymentsIcon sx={{ fontSize: 18 }} />}
                        {isPaid ? 'Paid' : 'Checkout'}
                      </button>
                      {!isPaid && (
                        <button onClick={() => dispatch(deleteAppointment({ doctorId: doctor.id, timeSlot: slot }))} className="w-12 h-12 flex items-center justify-center theme-text-muted theme-hover-danger rounded-2xl transition-all">
                          <DeleteForeverIcon sx={{ fontSize: 24 }} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main MasterSchedule Component ---
const MasterSchedule = () => {
  const dispatch = useDispatch();
  const { doctorsSchedule, selectedSpecialty, selectedDoctorId, searchQuery } = useSelector((state) => state.schedule);
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState('May');
  const [selectedWeek, setSelectedWeek] = useState(0);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = [2024, 2025, 2026, 2027];

  const sidebarItems = [
    { n: 'Dashboard', i: <DashboardIcon sx={{ fontSize: 20 }} /> },
    { n: 'Schedule', i: <CalendarMonthIcon sx={{ fontSize: 20 }} /> },
    { n: 'Patients', i: <GroupIcon sx={{ fontSize: 20 }} /> },
    { n: 'Registrations', i: <AppRegistrationIcon sx={{ fontSize: 20 }} /> },
    { n: 'Settings', i: <SettingsIcon sx={{ fontSize: 20 }} /> }
  ];

  const { weeksInMonth, currentWeekDays } = useMemo(() => {
    const monthIndex = months.indexOf(selectedMonth);
    const lastDayOfMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
    const weeks = [];
    for (let i = 0; i < lastDayOfMonth; i += 7) weeks.push(i);
    const startNum = (selectedWeek * 7) + 1;
    const daysLabels = ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'];
    const days = daysLabels.map((d, index) => {
      const dayNumber = startNum + index;
      return { short: d, num: dayNumber <= lastDayOfMonth ? dayNumber : null };
    });
    return { weeksInMonth: weeks, currentWeekDays: days };
  }, [selectedYear, selectedMonth, selectedWeek]);

  const filteredSchedule = useMemo(() => {
    return doctorsSchedule.filter(doc => {
      const matchSpec = selectedSpecialty === 'All Specialties' || doc.specialty === selectedSpecialty;
      const matchDoc = selectedDoctorId === 'All Doctors' || doc.id.toString() === selectedDoctorId;
      const matchSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSpec && matchDoc && matchSearch;
    });
  }, [doctorsSchedule, selectedSpecialty, selectedDoctorId, searchQuery]);

  return (
    <div className="flex theme-bg min-h-screen font-sans overflow-hidden theme-text">
      {/* Sidebar Navigation */}
      <aside className="w-60 theme-surface border-r theme-border flex flex-col fixed h-full z-10 shadow-sm">
        <div className="p-5 flex items-center gap-2 theme-text-accent font-bold text-lg">
          <MedicalServicesIcon /> ClinicConnect
        </div>
        <nav className="mt-2 px-4 space-y-1 flex-1">
          {sidebarItems.map(item => (
            <button key={item.n} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${item.n === 'Schedule' ? 'theme-accent-soft theme-text-accent font-bold' : 'theme-text-muted theme-hover-surface'}`}>
              {item.i}
              <span>{item.n}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t theme-border">
          <button className="w-full py-2.5 theme-surface border theme-border theme-text-danger rounded-xl font-bold text-[10px] flex items-center justify-center gap-2 theme-hover-danger transition-colors">
            <ReportProblemIcon sx={{ fontSize: 16 }} />
            <span>Emergency Entry</span>
          </button>
        </div>
      </aside>

      <main className="ml-60 flex-1 px-8 pt-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
             <div className="relative w-64">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted" sx={{ fontSize: 18 }} />
                <input 
                  type="text" placeholder="Search for doctors..." 
                  className="w-full pl-10 pr-4 py-2 theme-surface border-none shadow-sm rounded-xl text-xs outline-none theme-text"
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                />
             </div>
          </div>

          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl font-black theme-text tracking-tight leading-tight">Weekly Master Schedule</h1>
              <p className="theme-text-muted text-xs font-bold mt-1 tracking-wide uppercase">Department Management • {selectedMonth} {selectedYear}</p>
            </div>

            <div className="flex items-center gap-2 theme-surface p-1.5 rounded-2xl shadow-sm border theme-border">
              <select value={selectedDoctorId} onChange={(e) => dispatch(setDoctorFilter(e.target.value))} className="text-[10px] font-black theme-text-muted theme-bg border-none rounded-lg p-2 outline-none cursor-pointer">
                <option value="All Doctors">All Doctors</option>
                {Array.from(new Set(doctorsSchedule.map(d => d.name))).map(name => {
                  const doc = doctorsSchedule.find(d => d.name === name);
                  return <option key={doc.id} value={doc.id}>{doc.name}</option>;
                })}
              </select>
              
              <div className="h-5 w-px theme-border"></div>

              <select value={selectedYear} onChange={(e) => {setSelectedYear(Number(e.target.value)); setSelectedWeek(0);}} className="text-[10px] font-black theme-text-muted theme-bg border-none rounded-lg p-2 outline-none cursor-pointer">
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>

              <select value={selectedMonth} onChange={(e) => {setSelectedMonth(e.target.value); setSelectedWeek(0);}} className="text-[10px] font-black theme-text-muted theme-bg border-none rounded-lg p-2 outline-none cursor-pointer">
                {months.map(m => <option key={m} value={m}>{m.slice(0,3)}</option>)}
              </select>

              <div className="flex theme-bg p-1 rounded-xl">
                {weeksInMonth.map((_, idx) => (
                  <button key={idx} onClick={() => setSelectedWeek(idx)} className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${selectedWeek === idx ? 'theme-surface theme-text-accent shadow-sm' : 'theme-text-muted theme-hover-text-accent'}`}>W{idx + 1}</button>
                ))}
              </div>

              <div className="h-5 w-px theme-border"></div>

              <select value={selectedSpecialty} onChange={(e) => dispatch(setSpecialty(e.target.value))} className="text-[10px] font-black theme-text-accent theme-accent-soft border-none rounded-lg p-2 outline-none cursor-pointer">
                <option value="All Specialties">All Specialties</option>
                <option value="Surgery">Surgery</option>
                <option value="Internal Medicine">Internal Medicine</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
            </div>
          </div>

          <div className="theme-surface rounded-[2.5rem] border theme-border shadow-2xl shadow-slate-200/40 overflow-hidden">
            <div className="grid grid-cols-[80px_repeat(7,1fr)] theme-bg border-b theme-border">
              <div className="flex items-center justify-center border-r theme-border py-6">
                <MoreTimeIcon className="theme-text-muted opacity-50" />
              </div>
              {currentWeekDays.map((day, idx) => (
                <div key={idx} className={`text-center py-6 border-r theme-border last:border-0 ${!day.num ? 'opacity-20' : ''}`}>
                  <div className="text-[10px] font-black theme-text-accent opacity-50 uppercase mb-1 tracking-tighter">{day.short}</div>
                  <div className="text-2xl font-black theme-text">{day.num || '-'}</div>
                </div>
              ))}
            </div>

            <div className="h-[58vh] overflow-y-auto no-scrollbar">
              {['from : 8:00 to : 2:00', 'from : 4:00 to : 10:00'].map(time => (
                <div key={time} className="grid grid-cols-[80px_repeat(7,1fr)] border-b theme-border min-h-[140px]">
                  <div className="flex items-start justify-center pt-8 border-r theme-border text-xs font-black theme-text-muted italic opacity-30">{time}</div>
                  {currentWeekDays.map((day, idx) => (
                    <div key={idx} className="p-3 border-r theme-border last:border-0 relative theme-hover-surface transition-all">
                      {day.num && filteredSchedule
                        .filter(d => d.day === day.short && d.time === time)
                        .map(doctor => (
                          <div 
                            key={doctor.id} onClick={() => setActiveDoctor(doctor)}
                            className="p-4 rounded-2xl border-l-4 shadow-sm cursor-pointer hover:scale-[1.02] transition-transform mb-2 theme-surface theme-border theme-shadow-accent"
                            style={{ borderLeftColor: 'var(--color-accent)' }}
                          >
                            <div className="text-[11px] font-black theme-text-accent leading-tight">{doctor.name}</div>
                            <div className="text-[9px] theme-text-muted font-bold uppercase mt-1 tracking-wider">{doctor.specialty} • {doctor.room}</div>
                          </div>
                        ))
                      }
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {activeDoctor && <BookingModal doctor={activeDoctor} onClose={() => setActiveDoctor(null)} />}
    </div>
  );
};

export default MasterSchedule;