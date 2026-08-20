import { useEffect, useMemo, useState, useCallback } from "react";
import {
  normalizeSearchText,
  formatTimeTo24Hour,
} from "../components/scheduleFormatters";
import {
  useSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useEmptyDoctorsQuery,
  useSpecialtiesQuery,
} from "../service/scheduleService";

const DAY_KEY_BY_NAME = {
  السبت: "saturday",
  الأحد: "sunday",
  الاثنين: "monday",
  الإثنين: "monday",
  الثلاثاء: "tuesday",
  الأربعاء: "wednesday",
  الخميس: "thursday",
  الجمعة: "friday",
};

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

  const normalizeDoctor = (doctor = {}) => ({
    id: doctor.doctor_uuid || doctor.uuid || doctor.id || "",
    name: doctor.doctor_name || doctor.name || "غير معروف",
    specialization:
      doctor.specialization?.name || doctor.specialization || "غير معروف",
    clinic: doctor.clinic?.name || doctor.clinic || "",
  });

  const normalizeShift = (
    source = {},
    variant = "original",
    fallbackUuid = "",
    label,
  ) => {
    const doctor = normalizeDoctor(source);

    return {
      uuid:
        source.uuid ||
        `${fallbackUuid}-${variant}-${doctor.id || source.day || "shift"}`,
      start: formatTimeTo24Hour(source.start_time),
      end: formatTimeTo24Hour(source.end_time),
      label: label || (variant === "modified" ? "معدل" : "أساسي"),
      variant,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialization: doctor.specialization,
      clinic: doctor.clinic,
      startDate: source.start_date,
      endDate: source.end_date,
      isPermanent: source.is_permanent,
      swapType: source.swap_type,
    };
  };

  const addShiftToSchedule = (schedule, dayKey, shift) => {
    if (!dayKey) return;

    if (!schedule.weeklySchedule[dayKey]) {
      schedule.weeklySchedule[dayKey] = [];
    }

    schedule.weeklySchedule[dayKey].push(shift);

    if (shift.doctorId) {
      schedule.doctorIds = Array.from(
        new Set(
          [...(schedule.doctorIds || []), shift.doctorId].filter(Boolean),
        ),
      );
    }
  };

  apiData.forEach((entry) => {
    const isMergedSchedule = entry.original_schedule || entry.modified_schedule;

    if (isMergedSchedule) {
      const originalSchedule = entry.original_schedule || {};
      const modifiedSchedule = entry.modified_schedule || null;
      const primaryDoctor = normalizeDoctor(originalSchedule);
      const scheduleId =
        primaryDoctor.id || modifiedSchedule?.doctor_uuid || entry.uuid;

      if (!doctorsMap.has(scheduleId)) {
        doctorsMap.set(scheduleId, {
          id: scheduleId,
          doctorId: scheduleId,
          doctor: primaryDoctor,
          modifiedDoctor: modifiedSchedule
            ? normalizeDoctor(modifiedSchedule)
            : null,
          weeklySchedule: {},
          statusNote: entry.status_note || "",
          isModified: Boolean(entry.is_modified),
          doctorIds: [],
        });
      }

      const schedule = doctorsMap.get(scheduleId);
      schedule.doctor = primaryDoctor;
      schedule.modifiedDoctor = modifiedSchedule
        ? normalizeDoctor(modifiedSchedule)
        : schedule.modifiedDoctor;
      schedule.statusNote = entry.status_note || schedule.statusNote || "";
      schedule.isModified = Boolean(entry.is_modified);

      const originalDayKey = DAY_KEY_BY_NAME[originalSchedule.day] || null;
      const modifiedDayKey = DAY_KEY_BY_NAME[modifiedSchedule?.day] || null;

      addShiftToSchedule(
        schedule,
        originalDayKey,
        normalizeShift(
          originalSchedule,
          "original",
          entry.uuid,
          entry.is_modified ? "مبدل" : "أساسي",
        ),
      );

      if (modifiedSchedule) {
        addShiftToSchedule(
          schedule,
          modifiedDayKey || originalDayKey,
          normalizeShift(modifiedSchedule, "modified", entry.uuid, "معدل"),
        );
      }

      return;
    }

    const docId = entry.doctor?.uuid || entry.doctor_uuid || entry.uuid;
    if (!doctorsMap.has(docId)) {
      doctorsMap.set(docId, {
        id: docId,
        doctorId: docId,
        doctor: {
          name: entry.doctor?.name || entry.doctor_name || "غير معروف",
          specialization:
            entry.specialty?.name || entry.specialization || "غير معروف",
          clinic: entry.clinic?.name || entry.clinic || "",
        },
        weeklySchedule: {},
        statusNote: entry.is_active ? "نشط" : "غير نشط",
        isModified: Boolean(entry.is_modified),
        doctorIds: [docId],
      });
    }

    const schedule = doctorsMap.get(docId);
    const dayKey = dayIndexToKey(entry.day_of_week);
    addShiftToSchedule(
      schedule,
      dayKey,
      normalizeShift(
        {
          uuid: entry.uuid,
          start_time: entry.start_time,
          end_time: entry.end_time,
          day: entry.day,
          doctor_uuid: entry.doctor?.uuid || entry.doctor_uuid,
          doctor_name: entry.doctor?.name || entry.doctor_name,
          specialization: entry.specialty?.name || entry.specialization,
          clinic: entry.clinic?.name || entry.clinic,
          is_permanent: entry.is_permanent,
        },
        entry.is_modified ? "modified" : "original",
        entry.uuid,
        entry.is_modified ? "معدل" : "أساسي",
      ),
    );
  });

  return Array.from(doctorsMap.values());
};

export const useSchedulePage = () => {
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
        [
          item.doctor?.name,
          item.doctor?.specialization,
          item.doctor?.clinic,
          item.modifiedDoctor?.name,
          item.modifiedDoctor?.specialization,
          item.modifiedDoctor?.clinic,
          item.statusNote,
        ]
          .filter(Boolean)
          .join(" "),
      );
      const matchesSearch =
        !normalizedQuery || searchableText.includes(normalizedQuery);
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
    [
      dialogMode,
      selectedSchedule,
      createMutation,
      updateMutation,
      handleCloseDialog,
    ],
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
  }, [
    pendingDeleteSchedule,
    deleteMutation,
    selectedSchedule,
    handleCloseDialog,
  ]);

  const handleCancelDelete = useCallback(() => {
    setPendingDeleteSchedule(null);
  }, []);

  const usedDoctorIds = useMemo(
    () =>
      schedules
        .flatMap((item) =>
          item.doctorIds?.length ? item.doctorIds : [item.doctorId],
        )
        .filter(Boolean),
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
