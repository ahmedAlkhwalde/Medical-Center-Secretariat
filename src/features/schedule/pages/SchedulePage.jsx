import { useSchedulePage } from "../hooks/useSchedulePage";
import ScheduleHeader from "../components/ScheduleHeader";
import ScheduleFilters from "../components/ScheduleFilters";
import ScheduleList from "../components/ScheduleList";
import ScheduleDialog from "../components/ScheduleDialog";

const SchedulePage = () => {
  const {
    searchQuery,
    selectedSpecialtyUuid,
    selectedSchedule,
    dialogMode,
    isDialogOpen,
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
    isSaving,
    setSearchQuery,
    setSelectedSpecialtyUuid,
    handleResetFilters,
    handleAddSchedule,
    handleEditSchedule,
    handleCloseDialog,
    handleSaveSchedule,
  } = useSchedulePage();

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
        />
      )}

      <ScheduleDialog
        open={isDialogOpen}
        schedule={dialogMode === "edit" ? selectedSchedule : null}
        doctorOptions={emptyDoctors || []}
        usedDoctorIds={usedDoctorIds}
        onClose={handleCloseDialog}
        onSave={handleSaveSchedule}
        isSaving={isSaving}
      />
    </div>
  );
};

export default SchedulePage;