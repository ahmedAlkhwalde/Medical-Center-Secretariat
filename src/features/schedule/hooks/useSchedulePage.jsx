import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { normalizeSearchText } from "../components/scheduleFormatters";
import {
  useSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useEmptyDoctorsQuery,
  useSpecialtiesQuery,
} from "../service/scheduleService";

const transformScheduleData = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) return [];
  const doctorsMap = new Map();

  const dayIndexToKey = (dayOfWeek) => {
    const mapping = {
      1: "sunday",
      2: "monday",
      3: "tuesday",
      4: "wednesday",
      5: "thursday",
      6: "friday",
      7: "saturday",
    };
    return mapping[dayOfWeek] || "sunday";
  };

  apiData.forEach((entry) => {
    const docId = entry.doctor.uuid;
    if (!doctorsMap.has(docId)) {
      doctorsMap.set(docId, {
        id: docId,
        doctorId: docId,
        doctor: {
          name: entry.doctor.name,
          specialization: entry.specialty?.name || "غير معروف",
          clinic: entry.clinic?.name || "",
        },
        weeklySchedule: {},
        statusNote: entry.is_active ? "نشط" : "غير نشط",
      });
    }

    const schedule = doctorsMap.get(docId);
    const dayKey = dayIndexToKey(entry.day_of_week);
    if (!schedule.weeklySchedule[dayKey]) {
      schedule.weeklySchedule[dayKey] = [];
    }
    schedule.weeklySchedule[dayKey].push({
      start: entry.start_time?.substring(0, 5),
      end: entry.end_time?.substring(0, 5),
      label: entry.is_modified ? "معدل" : "دوام",
      uuid: entry.uuid,
    });
  });

  return Array.from(doctorsMap.values());
};

export const useSchedulePage = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialtyUuid, setSelectedSpecialtyUuid] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [dialogMode, setDialogMode] = useState("add");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingDeleteSchedule, setPendingDeleteSchedule] = useState(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  const { data: specialties = [] } = useSpecialtiesQuery();

  const {
    data: apiSchedules,
    isLoading,
    isError,
    error,
  } = useSchedulesQuery(selectedSpecialtyUuid);

  const { data: emptyDoctors } = useEmptyDoctorsQuery();
  const createMutation = useCreateScheduleMutation();
  const updateMutation = useUpdateScheduleMutation();
  const deleteMutation = useDeleteScheduleMutation();

  const schedules = useMemo(
    () => transformScheduleData(apiSchedules),
    [apiSchedules],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 767.98px)");
    const handleChange = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const specialtyOptions = useMemo(
    () => specialties.map((s) => ({ uuid: s.uuid, name: s.name })),
    [specialties],
  );

  const filteredSchedule = useMemo(() => {
    const normalizedQuery = normalizeSearchText(searchQuery);
    return schedules.filter((item) => {
      const searchableText = normalizeSearchText(
        [item.doctor.name, item.doctor.specialization, item.doctor.clinic].join(" "),
      );
      const matchesSearch = !normalizedQuery || searchableText.includes(normalizedQuery);
      return matchesSearch;
    });
  }, [searchQuery, schedules]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedSpecialtyUuid("");
  }, []);

  const handleAddSchedule = useCallback(() => {
    setSelectedSchedule(null);
    setDialogMode("add");
    setIsDialogOpen(true);
  }, []);

  const handleEditSchedule = useCallback((schedule) => {
    setSelectedSchedule(schedule);
    setDialogMode("edit");
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedSchedule(null);
    setDialogMode("add");
  }, []);

  const handleSaveSchedule = useCallback(
    (scheduleData) => {
      if (dialogMode === "edit" && selectedSchedule) {
        updateMutation.mutate(
          {
            doctor_uuid: scheduleData.doctor_uuid,
            schedules: scheduleData.schedules,
          },
          {
            onSuccess: () => {
              handleCloseDialog();
            },
          },
        );
      } else {
        createMutation.mutate(
          {
            doctor_uuid: scheduleData.doctor_uuid,
            schedules: scheduleData.schedules,
          },
          {
            onSuccess: () => {
              handleCloseDialog();
            },
          },
        );
      }
    },
    [dialogMode, selectedSchedule, createMutation, updateMutation, handleCloseDialog],
  );

  const handleDeleteSchedule = useCallback((schedule) => {
    setPendingDeleteSchedule(schedule);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!pendingDeleteSchedule) return;
    deleteMutation.mutate(pendingDeleteSchedule.id, {
      onSuccess: () => {
        setPendingDeleteSchedule(null);
        if (selectedSchedule?.id === pendingDeleteSchedule.id) {
          handleCloseDialog();
        }
      },
    });
  }, [pendingDeleteSchedule, deleteMutation, selectedSchedule, handleCloseDialog]);

  const handleCancelDelete = useCallback(() => {
    setPendingDeleteSchedule(null);
  }, []);

  const usedDoctorIds = useMemo(
    () => schedules.map((item) => item.doctorId),
    [schedules],
  );

  const hasActiveFilters = Boolean(searchQuery || selectedSpecialtyUuid);

  return {
    searchQuery,
    selectedSpecialtyUuid,
    selectedSchedule,
    dialogMode,
    isDialogOpen,
    pendingDeleteSchedule,
    isMobile,
    isLoading,
    isError,
    error,
    schedules,
    filteredSchedule,
    specialtyOptions,
    emptyDoctors,
    usedDoctorIds,
    hasActiveFilters,
    isSaving: createMutation.isPending || updateMutation.isPending,
    setSearchQuery,
    setSelectedSpecialtyUuid,
    handleResetFilters,
    handleAddSchedule,
    handleEditSchedule,
    handleCloseDialog,
    handleSaveSchedule,
    handleDeleteSchedule,
    handleConfirmDelete,
    handleCancelDelete,
  };
};