import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { normalizeSearchText } from "./scheduleFormatters";
import {
  useSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useEmptyDoctorsQuery,
  useSpecialtiesQuery, // ✅ من نفس الـ service
} from "../../services/scheduleService";
import ScheduleHeader from "./components/ScheduleHeader";
import ScheduleFilters from "./components/ScheduleFilters";
import ScheduleList from "./components/ScheduleList";
import ScheduleDialog from "./components/ScheduleDialog";
import ScheduleDeleteDialog from "./components/ScheduleDeleteDialog";
import { showSnackbar } from "../../features/uiSlice";

const transformScheduleData = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) return [];
  const doctorsMap = new Map();

  const dayIndexToKey = (dayOfWeek) => {
    const mapping = {
      1: "sunday", 2: "monday", 3: "tuesday", 4: "wednesday",
      5: "thursday", 6: "friday", 7: "saturday",
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

const SchedulePage = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialtyUuid, setSelectedSpecialtyUuid] = useState(""); // UUID
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [dialogMode, setDialogMode] = useState("add");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingDeleteSchedule, setPendingDeleteSchedule] = useState(null);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  // ✅ جلب التخصصات
  const { data: specialties = [] } = useSpecialtiesQuery();

  // ✅ جلب الجداول مع فلتر التخصص
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
    [apiSchedules]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 767.98px)");
    const handleChange = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // قائمة التخصصات لتمريرها إلى الفلاتر
  const specialtyOptions = useMemo(
    () => specialties.map((s) => ({ uuid: s.uuid, name: s.name })),
    [specialties]
  );

  const filteredSchedule = useMemo(() => {
    const normalizedQuery = normalizeSearchText(searchQuery);
    return schedules.filter((item) => {
      const searchableText = normalizeSearchText(
        [item.doctor.name, item.doctor.specialization, item.doctor.clinic].join(" ")
      );
      const matchesSearch =
        !normalizedQuery || searchableText.includes(normalizedQuery);
      return matchesSearch;
    });
  }, [searchQuery, schedules]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSpecialtyUuid("");
  };

  const handleAddSchedule = () => {
    setSelectedSchedule(null);
    setDialogMode("add");
    setIsDialogOpen(true);
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSchedule(null);
    setDialogMode("add");
  };

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
              dispatch(
                showSnackbar({
                  message: "تم تحديث الجدول بنجاح",
                  variant: "success",
                })
              );
              handleCloseDialog();
            },
            onError: () => {
              dispatch(
                showSnackbar({
                  message: "فشل تحديث الجدول",
                  variant: "error",
                })
              );
            },
          }
        );
      } else {
        createMutation.mutate(
          {
            doctor_uuid: scheduleData.doctor_uuid,
            schedules: scheduleData.schedules,
          },
          {
            onSuccess: () => {
              dispatch(
                showSnackbar({
                  message: "تم إضافة الجدول بنجاح",
                  variant: "success",
                })
              );
              handleCloseDialog();
            },
            onError: () => {
              dispatch(
                showSnackbar({
                  message: "فشل إضافة الجدول",
                  variant: "error",
                })
              );
            },
          }
        );
      }
    },
    [dialogMode, selectedSchedule, createMutation, updateMutation, dispatch]
  );

  const handleDeleteSchedule = (schedule) => {
    setPendingDeleteSchedule(schedule);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteSchedule) return;
    deleteMutation.mutate(pendingDeleteSchedule.id, {
      onSuccess: () => {
        dispatch(
          showSnackbar({ message: "تم حذف الجدول بنجاح", variant: "success" })
        );
        setPendingDeleteSchedule(null);
        if (selectedSchedule?.id === pendingDeleteSchedule.id) {
          handleCloseDialog();
        }
      },
      onError: () => {
        dispatch(
          showSnackbar({ message: "فشل حذف الجدول", variant: "error" })
        );
      },
    });
  };

  const handleCancelDelete = () => {
    setPendingDeleteSchedule(null);
  };

  const usedDoctorIds = useMemo(
    () => schedules.map((item) => item.doctorId),
    [schedules]
  );

  const hasActiveFilters = Boolean(searchQuery || selectedSpecialtyUuid);

  return (
    <div className="space-y-6">
      <ScheduleHeader
        schedules={schedules}
        specialtyOptions={specialtyOptions}
        onAddSchedule={handleAddSchedule}
        isLoading={isLoading}
      />

      <ScheduleFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSpecialtyUuid={selectedSpecialtyUuid}
        onSpecialtyUuidChange={setSelectedSpecialtyUuid}
        specialtyOptions={specialtyOptions}
        onResetFilters={handleResetFilters}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-2xl border theme-border theme-surface animate-pulse p-4"
            >
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
              <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
              <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex h-32 items-center justify-center rounded-2xl border theme-border theme-surface">
          <p className="text-red-500">تعذر تحميل الجداول: {error?.message}</p>
        </div>
      ) : (
        <ScheduleList
          filteredSchedule={filteredSchedule}
          isMobile={isMobile}
          hasActiveFilters={hasActiveFilters}
          onEditSchedule={handleEditSchedule}
          // onDeleteSchedule={handleDeleteSchedule}
        />
      )}

      <ScheduleDialog
        open={isDialogOpen}
        schedule={dialogMode === "edit" ? selectedSchedule : null}
        doctorOptions={emptyDoctors || []}
        usedDoctorIds={usedDoctorIds}
        onClose={handleCloseDialog}
        onSave={handleSaveSchedule}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

      {/* <ScheduleDeleteDialog
        open={Boolean(pendingDeleteSchedule)}
        schedule={pendingDeleteSchedule}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      /> */}
    </div>
  );
};

export default SchedulePage;