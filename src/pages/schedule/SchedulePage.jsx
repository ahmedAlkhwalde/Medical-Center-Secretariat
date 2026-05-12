import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { normalizeSearchText } from "./scheduleFormatters";
import {
  DOCTOR_OPTIONS,
  addSchedule,
  deleteSchedule,
  updateSchedule,
} from "../../features/schedule/scheduleSlice";
import ScheduleHeader from "./components/ScheduleHeader";
import ScheduleFilters from "./components/ScheduleFilters";
import ScheduleList from "./components/ScheduleList";
import ScheduleDialog from "./components/ScheduleDialog";
import ScheduleDeleteDialog from "./components/ScheduleDeleteDialog";

const SchedulePage = () => {
  const dispatch = useDispatch();
  const { schedules } = useSelector((state) => state.schedule);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [dialogMode, setDialogMode] = useState("add");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingDeleteSchedule, setPendingDeleteSchedule] = useState(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 767.98px)");
    const handleChange = (event) => setIsMobile(event.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const specialtyOptions = useMemo(
    () =>
      Array.from(new Set(schedules.map((item) => item.doctor.specialization))),
    [schedules],
  );

  const filteredSchedule = useMemo(() => {
    const normalizedQuery = normalizeSearchText(searchQuery);

    return schedules.filter((item) => {
      const matchesSpecialty =
        !selectedSpecialty || item.doctor.specialization === selectedSpecialty;

      const searchableText = normalizeSearchText(
        [item.doctor.name, item.doctor.specialization, item.doctor.clinic].join(
          " ",
        ),
      );

      const matchesSearch =
        !normalizedQuery || searchableText.includes(normalizedQuery);

      return matchesSpecialty && matchesSearch;
    });
  }, [searchQuery, selectedSpecialty, schedules]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("");
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

  const handleSaveSchedule = (scheduleData) => {
    if (dialogMode === "edit" && selectedSchedule) {
      dispatch(updateSchedule({ ...scheduleData, id: selectedSchedule.id }));
    } else {
      dispatch(addSchedule(scheduleData));
    }

    handleCloseDialog();
  };

  const handleDeleteSchedule = (schedule) => {
    setPendingDeleteSchedule(schedule);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteSchedule) {
      return;
    }

    const scheduleToDelete = pendingDeleteSchedule;

    dispatch(deleteSchedule(scheduleToDelete.id));
    setPendingDeleteSchedule(null);

    if (selectedSchedule?.id === scheduleToDelete.id) {
      handleCloseDialog();
    }
  };

  const handleCancelDelete = () => {
    setPendingDeleteSchedule(null);
  };

  const usedDoctorIds = useMemo(
    () => schedules.map((item) => item.doctorId),
    [schedules],
  );

  const hasActiveFilters = Boolean(searchQuery || selectedSpecialty);

  return (
    <div className="space-y-6">
      <ScheduleHeader
        schedules={schedules}
        specialtyOptions={specialtyOptions}
        onAddSchedule={handleAddSchedule}
      />

      <ScheduleFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSpecialty={selectedSpecialty}
        onSpecialtyChange={setSelectedSpecialty}
        specialtyOptions={specialtyOptions}
        onResetFilters={handleResetFilters}
      />

      <ScheduleList
        filteredSchedule={filteredSchedule}
        isMobile={isMobile}
        hasActiveFilters={hasActiveFilters}
        onEditSchedule={handleEditSchedule}
        onDeleteSchedule={handleDeleteSchedule}
      />

      <ScheduleDialog
        open={isDialogOpen}
        schedule={dialogMode === "edit" ? selectedSchedule : null}
        doctorOptions={DOCTOR_OPTIONS}
        usedDoctorIds={usedDoctorIds}
        onClose={handleCloseDialog}
        onSave={handleSaveSchedule}
      />

      <ScheduleDeleteDialog
        open={Boolean(pendingDeleteSchedule)}
        schedule={pendingDeleteSchedule}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default SchedulePage;
