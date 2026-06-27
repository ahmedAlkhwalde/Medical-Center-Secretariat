import { motion as Motion } from "framer-motion";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CancelIcon from "@mui/icons-material/Cancel";
import CallIcon from "@mui/icons-material/Call";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import VerifiedIcon from "@mui/icons-material/Verified";
import PaymentsIcon from "@mui/icons-material/Payments";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from "@mui/icons-material/Search";
import CakeIcon from "@mui/icons-material/Cake";
import { getSpecialtyLabel, DAY_LABELS } from "../../../features/appointment/store/appointmentslice";
import { useBookingModal } from "../hooks/useBookingModal";
import { useSelector } from "react-redux";
import {useRealTimeAllAppointments} from "../service/appointmentService"

const isMovableStatus = (status) =>
  status === "has booked" || status === "has changed";

const BookingModal = ({ doctor, onClose, selectedDate }) => {
  const user = useSelector((state) => state.auth.user.uuid);
  useRealTimeAllAppointments(user);
  const {
    scrollRef,
    isApiLoading,
    displayPatientsList,
    isSearching,
    patientForm,
    editingPatientUuid,
    pendingSlot,
    dragOverBusySlot,
    slots,
    apiData,
    appointments,
    targetDateISO,
    displayFormattedDate,
    selectedWeek,
    queryClient,
    updateToWaitingMutation,
    updateToPaidMutation,
    deleteAppointmentServerMutation,
    createPatientMutation,
    updatePatientMutation,
    handleDrop,
    handleSavePatient,
    handleDeletePatient,
    handleEditClick,
    clearPatientForm,
    setPatientForm,
    setPendingSlot,
    setDragOverBusySlot,
  } = useBookingModal({ doctor, selectedDate });

  if (!doctor) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(15,23,42,0.85)] backdrop-blur-md p-0 sm:p-4"
      onClick={onClose}
    >
      <Motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="theme-surface w-full max-w-6xl rounded-3xl border theme-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col lg:flex-row-reverse max-h-[85vh]">
          {/* لوحة البحث المدمج وإدارة المرضى */}
          <aside className="theme-surface-90 lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-l theme-border p-5 sm:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl theme-accent text-white shadow-md">
                  <SearchIcon />
                </div>
                <h3 className="text-sm font-black theme-text">نتائج مطابقة السيرفر</h3>
              </div>
              {isSearching && <CircularProgress size={16} className="theme-text-accent" />}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 mb-5 pr-1 no-scrollbar">
              {displayPatientsList.length === 0 ? (
                <div className="text-xs text-center theme-text-muted border border-dashed theme-border rounded-2xl py-12 font-bold px-4 leading-normal">
                  {patientForm.name.trim()
                    ? "لا يوجد تطابق في السيرفر لهذا الاسم، يرجى إكمال الحقول بالأسفل لتسجيله كمريض جديد."
                    : "اكتب اسم المريض بالأسفل للبحث الفوري عنه في قاعدة البيانات أو لإنشاء كرت جديد له."}
                </div>
              ) : (
                displayPatientsList.map((p) => (
                  <div
                    key={p.uuid || p.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("patient", JSON.stringify(p))}
                    className="p-4 rounded-2xl theme-surface border-2 border-solid theme-border cursor-grab shadow-md hover:shadow-lg transition-all group relative"
                  >
                    <div className="flex justify-between items-start pl-14">
                      <div>
                        <div className="font-black theme-text text-sm leading-tight">
                          {p.name} {p.nick_name || p.nickname ? `(${p.nick_name || p.nickname})` : ""}
                        </div>
                        <div className="flex flex-col gap-0.5 mt-2 text-xs theme-text-muted font-bold">
                          <span className="flex items-center gap-1">
                            <CallIcon sx={{ fontSize: 13 }} />
                            {p.phone}
                          </span>
                          {(p.birthday || p.date_of_birth) && (
                            <span className="text-[10px] text-gray-400 mt-0.5">
                              تولد: {p.birthday || p.date_of_birth}
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`theme-accent-soft px-2.5 py-1 rounded-lg text-[11px] font-black shrink-0 ${
                          p.gender === "female" || p.gender === "Female"
                            ? "text-pink-500 bg-pink-50"
                            : "theme-text-accent"
                        }`}
                      >
                        {p.gender === "female" || p.gender === "Female" ? "أنثى" : "ذكر"}
                      </span>
                    </div>
                    <div className="absolute left-2 bottom-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-all"
                        title="تعديل المريض"
                      >
                        <EditIcon sx={{ fontSize: 14 }} />
                      </button>
                      <button
                        onClick={() => handleDeletePatient(p.uuid)}
                        className="w-7 h-7 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100 transition-all"
                        title="حذف المريض"
                      >
                        <DeleteForeverIcon sx={{ fontSize: 14 }} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="theme-surface border theme-border rounded-3xl p-4 shadow-md bg-opacity-40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-black theme-text-accent tracking-wide">
                  {editingPatientUuid ? "تعديل بيانات المريض الحالية" : "بيانات الحساب الجديد"}
                </span>
                {editingPatientUuid && (
                  <button onClick={clearPatientForm} className="text-[10px] text-red-500 font-bold hover:underline">
                    إلغاء التعديل
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 relative">
                  <input
                    type="text"
                    placeholder="الاسم الكامل (بحث / إنشاء)..."
                    className="w-full p-2.5 pl-8 theme-bg rounded-xl text-xs border-2 theme-border font-black outline-none theme-text focus:border-(--color-accent-primary)"
                    value={patientForm.name}
                    onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                  />
                </div>
                <input
                  type="text"
                  placeholder="اللقب / الكنية"
                  className="w-full p-2.5 theme-bg rounded-xl text-xs border theme-border outline-none theme-text"
                  value={patientForm.nick_name}
                  onChange={(e) => setPatientForm({ ...patientForm, nick_name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="الهاتف"
                  className="w-full p-2.5 theme-bg rounded-xl text-xs border theme-border outline-none theme-text"
                  value={patientForm.phone}
                  onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                />
                <input
                  type="date"
                  className="w-full p-2.5 theme-bg rounded-xl text-xs border theme-border theme-text outline-none"
                  value={patientForm.date_of_birth}
                  onChange={(e) => setPatientForm({ ...patientForm, date_of_birth: e.target.value })}
                />
                <select
                  className="w-full p-2.5 theme-bg rounded-xl text-xs border theme-border theme-text outline-none cursor-pointer"
                  value={patientForm.gender}
                  onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
                <button
                  onClick={handleSavePatient}
                  disabled={createPatientMutation.isPending || updatePatientMutation.isPending}
                  className="col-span-2 w-full py-2.5 theme-accent theme-text-on-accent font-black rounded-xl text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {createPatientMutation.isPending || updatePatientMutation.isPending ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <PersonAddIcon sx={{ fontSize: 18 }} />
                  )}
                  {createPatientMutation.isPending || updatePatientMutation.isPending
                    ? "جاري الحفظ..."
                    : editingPatientUuid
                      ? "حفظ التغييرات"
                      : "إضافة المريض وتأكيد البطاقة"}
                </button>
              </div>
            </div>
          </aside>

          {/* الفترات الزمنية للمواعيد */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto no-scrollbar p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black theme-text">{doctor.name}</h2>
                <p className="theme-text-muted font-bold text-sm mt-2 flex items-center gap-2">
                  <CalendarMonthIcon className="theme-text-accent" sx={{ fontSize: 18 }} />
                  {getSpecialtyLabel(doctor.specialty)} • {DAY_LABELS[doctor.day] || doctor.day} ({displayFormattedDate}) • الأسبوع {selectedWeek + 1}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 rounded-xl theme-surface border theme-border theme-text-muted hover:theme-hover-surface text-xs font-bold"
              >
                <CancelIcon sx={{ fontSize: 18 }} /> إغلاق
              </button>
            </div>

            {isApiLoading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3">
                <CircularProgress color="inherit" className="theme-text-accent" />
                <span className="text-sm font-bold theme-text-muted">جاري مزامنة المواعيد...</span>
              </div>
            ) : (
              <div className="grid gap-3">
                {slots.map((slot) => {
                  const apiAppointments = apiData?.appointments || [];
                  const apiMatch = apiAppointments.find((app) => {
                    if (!app.date_time) return false;
                    const cleanDateTime = app.date_time.replace("T", " ");
                    const [datePart, timePart] = cleanDateTime.split(" ");
                    if (!datePart || !timePart) return false;
                    const appSlot = timePart.substring(0, 5);
                    return datePart === targetDateISO && appSlot === slot;
                  });

                  let booking = null;
                  if (apiMatch) {
                    booking = {
                      uuid: apiMatch.uuid,
                      patientName: apiMatch.name,
                      nick_name: apiMatch.nick_name || apiMatch.nickname || "",
                      phone: apiMatch.phone || "لا يوجد هاتف",
                      age: apiMatch.age || "",
                      bookingDate: targetDateISO,
                      gender: apiMatch.gender,
                      status: apiMatch.status,
                      isApiData: true,
                    };
                  } else {
                    booking = appointments.find(
                      (a) =>
                        a.doctorId === doctor.id &&
                        a.timeSlot === slot &&
                        a.bookingDate === displayFormattedDate,
                    );
                  }

                  const status = booking?.status;
                  const isHasBooked = status === "has booked";
                  const isChangig = status === "has changed";
                  const isWaiting = status === "is waiting";
                  const isVisited = status === "has visited";
                  const isPaid = status === "paid";

                  const canDrag = !!booking && isMovableStatus(booking.status);

                  const isWaitingPending =
                    updateToWaitingMutation.isPending &&
                    updateToWaitingMutation.variables === booking?.uuid;
                  const isPaidPending =
                    updateToPaidMutation.isPending &&
                    updateToPaidMutation.variables === booking?.uuid;
                  const isDeletePending =
                    deleteAppointmentServerMutation.isPending &&
                    deleteAppointmentServerMutation.variables === booking?.uuid;

                  const isThisSlotPending = pendingSlot === slot;

                  return (
                    <div
                      key={slot}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (booking && !isThisSlotPending) {
                          e.dataTransfer.dropEffect = "none";
                          setDragOverBusySlot(true);
                        } else {
                          e.dataTransfer.dropEffect = "move";
                          setDragOverBusySlot(false);
                        }
                      }}
                      onDragLeave={() => setDragOverBusySlot(false)}
                      onDrop={(e) => handleDrop(e, slot)}
                      draggable={canDrag}
                      onDragStart={(e) => {
                        if (!canDrag) return;
                        e.dataTransfer.setData(
                          "moveAppointment",
                          JSON.stringify({ fromSlot: slot, patient: booking }),
                        );
                      }}
                      className={`relative p-5 sm:p-6 rounded-3xl border-2 transition-all flex flex-col gap-4 md:flex-row md:items-center md:justify-between
                        ${booking ? (isPaid ? "theme-border theme-accent-soft" : "theme-border theme-surface shadow-xl") : "border-dashed theme-border theme-bg/20"}
                        ${isThisSlotPending ? "opacity-60 pointer-events-none" : ""}
                        ${canDrag ? "cursor-grab active:cursor-grabbing" : ""}`}
                    >
                      {isThisSlotPending && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl theme-surface/60 backdrop-blur-[1px]">
                          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl theme-surface border theme-border shadow-md">
                            <CircularProgress size={16} className="theme-text-accent" />
                            <span className="text-xs font-bold theme-text-muted">جاري الحفظ...</span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
                        <div className={`text-2xl sm:text-3xl font-black ${isPaid ? "theme-text-accent" : booking ? "theme-text" : "opacity-30 theme-text"}`}>
                          {slot}
                        </div>
                        {booking ? (
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="text-lg sm:text-xl font-black theme-text">
                                {booking.patientName} {booking.nick_name ? `(${booking.nick_name})` : ""}
                              </span>
                              <span className={`text-[11px] px-2 py-0.5 rounded-full font-black text-white ${
                                booking.gender === "Female" || booking.gender === "female" ? "bg-pink-500" : "bg-blue-500"
                              }`}>
                                {booking.gender === "Female" || booking.gender === "female" ? "أنثى" : "ذكر"}
                              </span>
                              <span className="text-[10px] theme-bg border theme-border theme-text-muted px-2 py-0.5 rounded-md font-bold">
                                {isHasBooked && "تم الحجز"}
                                {isChangig && "تم النقل"}
                                {isWaiting && "في الانتظار"}
                                {isPaid && "مكتمل ومدفوع"}
                                {isVisited && "تمت الزيارة"}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-bold theme-text-muted mt-2">
                              <span className="flex items-center gap-1">
                                <CallIcon sx={{ fontSize: 14 }} className="theme-text-accent" />
                                {booking.phone}
                              </span>
                              {booking.age && (
                                <span className="flex items-center gap-1">
                                  <CakeIcon sx={{ fontSize: 14 }} className="text-amber-500" />
                                  العمر: {booking.age} سنة
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <EventAvailableIcon sx={{ fontSize: 14 }} />
                                {booking.bookingDate}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="theme-text-muted opacity-60 font-bold text-sm">جاهز للحجز</div>
                        )}
                      </div>

                      {booking && booking.isApiData && (
                        <div className="flex items-center gap-3">
                          {(isHasBooked || isChangig) && (
                            <button
                              onClick={() =>
                                updateToWaitingMutation.mutate(booking.uuid, {
                                  onSuccess: () =>
                                    queryClient.invalidateQueries({
                                      queryKey: ["doctorAppointments", doctor.id, selectedDate],
                                    }),
                                })
                              }
                              disabled={
                                isWaitingPending ||
                                updateToWaitingMutation.isPending ||
                                updateToPaidMutation.isPending ||
                                deleteAppointmentServerMutation.isPending
                              }
                              className="flex cursor-pointer items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm transition-all shadow-lg theme-surface border theme-border theme-text hover:theme-hover-surface min-w-[120px] justify-center"
                            >
                              {isWaitingPending ? (
                                <CircularProgress size={16} color="inherit" />
                              ) : (
                                <HourglassEmptyIcon sx={{ fontSize: 18 }} />
                              )}
                              {isWaitingPending ? "جاري النقل..." : "إلى الانتظار"}
                            </button>
                          )}

                          {isVisited && (
                            <button
                              onClick={() =>
                                updateToPaidMutation.mutate(booking.uuid, {
                                  onSuccess: () =>
                                    queryClient.invalidateQueries({
                                      queryKey: ["doctorAppointments", doctor.id, selectedDate],
                                    }),
                                })
                              }
                              disabled={
                                isPaidPending ||
                                updateToWaitingMutation.isPending ||
                                updateToPaidMutation.isPending ||
                                deleteAppointmentServerMutation.isPending
                              }
                              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm transition-all shadow-lg theme-accent theme-text-on-accent min-w-[130px] justify-center"
                            >
                              {isPaidPending ? (
                                <CircularProgress size={16} color="inherit" />
                              ) : (
                                <PaymentsIcon sx={{ fontSize: 18 }} />
                              )}
                              {isPaidPending ? "جاري التحصيل..." : "تحصيل ودفع"}
                            </button>
                          )}

                          {isPaid && (
                            <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl theme-accent-soft theme-text-accent text-sm font-black">
                              <VerifiedIcon sx={{ fontSize: 18 }} />
                              مدفوع بالكامل
                            </div>
                          )}

                          {(isHasBooked || isChangig) && (
                            <button
                              onClick={() =>
                                deleteAppointmentServerMutation.mutate(booking.uuid, {
                                  onSuccess: () =>
                                    queryClient.invalidateQueries({
                                      queryKey: ["doctorAppointments", doctor.id, selectedDate],
                                    }),
                                })
                              }
                              disabled={
                                isDeletePending ||
                                updateToWaitingMutation.isPending ||
                                updateToPaidMutation.isPending
                              }
                              className="w-11 h-11 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                              title="إلغاء وحذف الحجز من السيرفر"
                            >
                              {isDeletePending ? (
                                <CircularProgress size={20} color="error" />
                              ) : (
                                <DeleteForeverIcon sx={{ fontSize: 22 }} />
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Motion.div>
    </div>
  );
};

export default BookingModal;