import { useMemo, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import {
  useGetDoctorAppointments,
  useUpdateToWaitingMutation,
  useUpdateToPaidMutation,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useSearchPatients,
  useAddAppointmentMutation,
  useDeleteAppointmentMutation,
  useUpdateAppointmentMutation,
  useRealTimeAllAppointments,
} from "../service/appointmentService";
import {
  addAppointment,
  deleteAppointment,
} from "../../../features/appointment/store/appointmentslice";

const calculateAge = (dateString) => {
  if (!dateString) return "";
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

const isMovableStatus = (status) =>
  status === "has booked" || status === "has changed";

export const useBookingModal = ({ doctor, selectedDate }) => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const queryClient = useQueryClient();

  const { appointments, selectedWeek } = useSelector(
    (state) => state.appointment,
  );

  const { data: apiData, isLoading: isApiLoading } = useGetDoctorAppointments(
    doctor?.id,
    selectedDate,
  );

  const updateToWaitingMutation = useUpdateToWaitingMutation();
  const updateToPaidMutation = useUpdateToPaidMutation();
  const addAppointmentServerMutation = useAddAppointmentMutation();
  const deleteAppointmentServerMutation = useDeleteAppointmentMutation();
  const updateAppointmentMutation = useUpdateAppointmentMutation();

  const createPatientMutation = useCreatePatientMutation();
  const updatePatientMutation = useUpdatePatientMutation();
  const deletePatientMutation = useDeletePatientMutation();

  const [activePatient, setActivePatient] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingPatientUuid, setEditingPatientUuid] = useState(null);
  const [pendingSlot, setPendingSlot] = useState(null);
  const [dragOverBusySlot, setDragOverBusySlot] = useState(false);

  const [patientForm, setPatientForm] = useState({
    name: "",
    nick_name: "",
    phone: "",
    date_of_birth: "",
    gender: "male",
  });

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(patientForm.name), 400);
    return () => clearTimeout(handler);
  }, [patientForm.name]);

  const { data: serverSearchResults, isFetching: isSearching } =
    useSearchPatients(debouncedSearch);

  const displayPatientsList = useMemo(() => {
    if (debouncedSearch.trim().length > 0) {
      if (!serverSearchResults) return [];
      return Array.isArray(serverSearchResults)
        ? serverSearchResults
        : serverSearchResults.data || [];
    }
    return activePatient ? [activePatient] : [];
  }, [debouncedSearch, serverSearchResults, activePatient]);

  const getFormattedDate = (dayName, weekOffset = 0) => {
    const now = new Date();
    const dayIndexMap = {
      SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6,
    };
    const targetDayIndex = dayIndexMap[dayName?.toUpperCase()];
    let diff = targetDayIndex - now.getDay();
    diff += weekOffset * 7;
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + diff);
    return targetDate.toLocaleDateString("en-GB");
  };

  const getYYYYMMDDStr = (dayName, weekOffset = 0) => {
    if (!dayName) return "";
    const now = new Date();
    const dayIndexMap = {
      SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6,
    };
    const targetDayIndex = dayIndexMap[dayName.toUpperCase()];
    let diff = targetDayIndex - now.getDay();
    diff += weekOffset * 7;
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + diff);
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
    const dd = String(targetDate.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const targetDateISO = useMemo(() => {
    if (selectedDate) {
      if (typeof selectedDate === "string") return selectedDate.split(" ")[0];
      if (selectedDate instanceof Date) {
        const yyyy = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const dd = String(selectedDate.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      }
    }
    return getYYYYMMDDStr(doctor?.day, selectedWeek);
  }, [doctor?.day, selectedWeek, selectedDate]);

  const displayFormattedDate = useMemo(() => {
    if (selectedDate) {
      const d = new Date(selectedDate);
      return d.toLocaleDateString("en-GB");
    }
    return getFormattedDate(doctor?.day, selectedWeek);
  }, [doctor?.day, selectedWeek, selectedDate]);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const { top, bottom } = container.getBoundingClientRect();
    if (e.clientY < top + 80) container.scrollTop -= 20;
    else if (e.clientY > bottom - 80) container.scrollTop += 20;
  };

  const slots = useMemo(() => {
    if (!doctor?.workingHours) return [];
    try {
      const matches = doctor.workingHours.match(/(\d{2}):(\d{2})/g);
      if (!matches || matches.length < 2) return [];
      const [startStr, endStr] = matches;
      const [startHours, startMinutes] = startStr.split(":").map(Number);
      const [endHours, endMinutes] = endStr.split(":").map(Number);
      let durationMinutes = 20;
      if (doctor.slot) {
        const slotParts = doctor.slot.split(":");
        if (slotParts.length >= 2) {
          durationMinutes = Number(slotParts[0]) * 60 + Number(slotParts[1]);
        }
      }
      if (durationMinutes <= 0) durationMinutes = 20;
      const timeSlots = [];
      let currentTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
      while (currentTotalMinutes < endTotalMinutes) {
        const h = Math.floor(currentTotalMinutes / 60);
        const m = currentTotalMinutes % 60;
        timeSlots.push(
          `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
        );
        currentTotalMinutes += durationMinutes;
      }
      return timeSlots;
    } catch (error) {
      console.error("Error parsing dynamic doctor slots:", error);
      return [];
    }
  }, [doctor]);

  const appointmentsQueryKey = useMemo(
    () => ["doctorAppointments", doctor?.id, selectedDate],
    [doctor?.id, selectedDate],
  );

  const addAppointmentToCache = (newAppointment) => {
    queryClient.setQueryData(appointmentsQueryKey, (old) => {
      if (!old) return old;
      const oldAppointments = old.appointments || [];
      return { ...old, appointments: [...oldAppointments, newAppointment] };
    });
  };

  const updateAppointmentTimeInCache = (appointmentUuid, newTime) => {
    queryClient.setQueryData(appointmentsQueryKey, (old) => {
      if (!old) return old;
      const oldAppointments = old.appointments || [];
      return {
        ...old,
        appointments: oldAppointments.map((app) => {
          if (app.uuid !== appointmentUuid) return app;
          const cleanDateTime = (app.date_time || "").replace("T", " ");
          const [datePart] = cleanDateTime.split(" ");
          return { ...app, date_time: `${datePart || targetDateISO} ${newTime}:00` };
        }),
      };
    });
  };

  const upsertAppointmentInCache = (appointmentData) => {
    queryClient.setQueryData(appointmentsQueryKey, (old) => {
      const oldAppointments = old?.appointments || [];
      const existingIndex = oldAppointments.findIndex(
        (app) => app.uuid === appointmentData.uuid,
      );
      let newAppointments;
      if (existingIndex !== -1) {
        newAppointments = [...oldAppointments];
        newAppointments[existingIndex] = {
          ...newAppointments[existingIndex],
          ...appointmentData,
        };
      } else {
        newAppointments = [...oldAppointments, appointmentData];
      }
      return { ...(old || {}), appointments: newAppointments };
    });
  };

  const removeAppointmentFromCache = (appointmentUuid) => {
    queryClient.setQueryData(appointmentsQueryKey, (old) => {
      if (!old) return old;
      const oldAppointments = old.appointments || [];
      return {
        ...old,
        appointments: oldAppointments.filter((app) => app.uuid !== appointmentUuid),
      };
    });
  };

  useEffect(() => {
    if (!doctor?.id) return;
    const appointmentsRef = collection(db, "appointments");
    const realtimeQuery = query(
      appointmentsRef,
      where("user_uuid", "==", doctor.id),
    );
    const unsubscribe = onSnapshot(
      realtimeQuery,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const docData = change.doc.data();
          const docUuid = docData.uuid || docData.id || change.doc.id;
          const rawDateTime = docData.date_time || "";
          const cleanDateTime = rawDateTime.replace("T", " ");
          const [docDatePart] = cleanDateTime.split(" ");
          if (docDatePart && docDatePart !== targetDateISO) return;
          if (change.type === "added" || change.type === "modified") {
            const appointmentData = {
              uuid: docUuid,
              name: docData.name,
              nick_name: docData.nick_name || docData.nickname || "",
              phone: docData.phone || "لا يوجد هاتف",
              age: docData.age || "",
              gender: docData.gender,
              status: docData.status,
              date_time: cleanDateTime || `${targetDateISO} 00:00:00`,
            };
            upsertAppointmentInCache(appointmentData);
          } else if (change.type === "removed") {
            removeAppointmentFromCache(docUuid);
          }
        });
      },
      (error) => console.error("❌ [Firebase Realtime Error]:", error),
    );
    return () => unsubscribe();
  }, [doctor?.id, targetDateISO, appointmentsQueryKey, queryClient]);

  const isSlotBusy = (slot) => {
    const apiAppointments = apiData?.appointments || [];
    const apiMatch = apiAppointments.find((app) => {
      if (!app.date_time) return false;
      const [datePart, timePart] = app.date_time.replace("T", " ").split(" ");
      return datePart === targetDateISO && timePart?.substring(0, 5) === slot;
    });
    const localMatch = appointments.find(
      (a) => a.doctorId === doctor?.id && a.timeSlot === slot,
    );
    return !!(apiMatch || localMatch);
  };

  const handleDrop = async (e, targetSlot) => {
    e.preventDefault();
    setDragOverBusySlot(false);

    if (isSlotBusy(targetSlot)) {
      // ✅ الإشعار الآن في الخدمة (isSlotBusy لا يزال محلياً لكن التحقق هنا فقط)
      // سنترك التحقق المحلي، لكننا لن نرسل إشعاراً مزدوجاً
      return;
    }

    const patientData = e.dataTransfer.getData("patient");
    const moveData = e.dataTransfer.getData("moveAppointment");

    if (patientData) {
      const p = JSON.parse(patientData);
      const patientUuid = p.uuid || p.id;
      setPendingSlot(targetSlot);

      addAppointmentServerMutation.mutate(
        {
          patientUuid: patientUuid,
          appointmentData: {
            date: targetDateISO,
            time: targetSlot,
            DoctorUuid: doctor.id,
            Type: "check",
          },
        },
        {
          onSuccess: (res) => {
            const created = res?.data || res?.appointment || res || {};
            const newAppointment = {
              uuid: created.uuid || created.id,
              name: created.name || p.name,
              nick_name: created.nick_name || created.nickname || p.nick_name || p.nickname || "",
              phone: created.phone || p.phone || "لا يوجد هاتف",
              age: created.age ?? (p.date_of_birth || p.birthday ? calculateAge(p.date_of_birth || p.birthday) : ""),
              gender: created.gender || p.gender,
              status: created.status || "has booked",
              date_time: created.date_time || `${targetDateISO} ${targetSlot}:00`,
            };
            if (newAppointment.uuid) {
              addAppointmentToCache(newAppointment);
            } else {
              queryClient.invalidateQueries({ queryKey: appointmentsQueryKey });
            }
            setPendingSlot(null);
          },
          onError: () => {
            setPendingSlot(null);
          },
        },
      );
    } else if (moveData) {
      const { fromSlot, patient } = JSON.parse(moveData);
      if (fromSlot === targetSlot) return;

      if (!isMovableStatus(patient.status)) {
        return;
      }

      if (patient.uuid && patient.isApiData) {
        setPendingSlot(targetSlot);

        updateAppointmentMutation.mutate(
          { id: patient.uuid, updatedData: { time: targetSlot } },
          {
            onSuccess: () => {
              updateAppointmentTimeInCache(patient.uuid, targetSlot);
              setPendingSlot(null);
            },
            onError: () => {
              setPendingSlot(null);
            },
          },
        );
      } else {
        dispatch(deleteAppointment({ doctorId: doctor.id, timeSlot: fromSlot }));
        dispatch(
          addAppointment({ ...patient, timeSlot: targetSlot, bookingDate: displayFormattedDate }),
        );
      }
    }
  };

  const handleSavePatient = () => {
    if (!patientForm.name || !patientForm.phone) return;
    if (editingPatientUuid) {
      updatePatientMutation.mutate(
        { uuid: editingPatientUuid, patientData: patientForm },
        {
          onSuccess: (res) => {
            if (res && res.data) setActivePatient(res.data);
            clearPatientForm();
          },
        },
      );
    } else {
      createPatientMutation.mutate(patientForm, {
        onSuccess: (res) => {
          if (res) setActivePatient(res);
          clearPatientForm();
        },
      });
    }
  };

  const handleDeletePatient = (uuid) => {
    deletePatientMutation.mutate(uuid, {
      onSuccess: () => {
        setActivePatient(null);
        if (editingPatientUuid === uuid) clearPatientForm();
      },
    });
  };

  const handleEditClick = (p) => {
    setEditingPatientUuid(p.uuid);
    setPatientForm({
      name: p.name || "",
      nick_name: p.nick_name || p.nickname || "",
      phone: p.phone || "",
      date_of_birth: p.birthday || p.date_of_birth || "",
      gender: p.gender === "female" || p.gender === "Female" ? "female" : "male",
    });
  };

  const clearPatientForm = () => {
    setEditingPatientUuid(null);
    setPatientForm({ name: "", nick_name: "", phone: "", date_of_birth: "", gender: "male" });
  };

  return {
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
    doctor,
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
  };
};