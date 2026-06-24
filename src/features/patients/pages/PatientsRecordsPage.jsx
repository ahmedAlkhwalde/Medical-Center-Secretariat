import { motion as Motion, AnimatePresence } from "framer-motion";
import { Search, SearchOff } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { usePatientsRecords } from "../hooks/usePatientsRecords";
import PatientCard from "../components/PatientCard";
import PatientRecordDetail from "./PatientRecordDetail";

const PatientsRecordsPage = () => {
  const {
    selectedPatient,
    localSearchQuery,
    showSearchResults,
    isLoading,
    isFetching,
    searchResults,
    handleSearchChange,
    handlePatientSelect,
    handleBackToSearch,
    handleResetSearch,
  } = usePatientsRecords();

  if (selectedPatient) {
    return (
      <PatientRecordDetail
        patient={selectedPatient}
        onBack={handleBackToSearch}
      />
    );
  }

  return (
    <div className="min-w-full min-h-screen">
      <div className="-mx-3 -my-4 sm:-mx-4 md:-mx-8 lg:-mx-10">
        {/* قسم واجهة البحث الموحد */}
        <div
          className={
            showSearchResults
              ? "sticky -top-4 z-10 py-4 mb-6 -mx-3 px-3 backdrop-blur-md theme-surface-90 transition-all duration-300"
              : "flex flex-col items-center justify-center min-h-125 py-12 transition-all duration-300"
          }
        >
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            {!showSearchResults && (
              <div className="flex flex-col items-center w-full">
                <Motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-6"
                >
                  <SearchOff
                    sx={{
                      fontSize: 120,
                      color: "var(--color-text-muted)",
                      opacity: 0.3,
                    }}
                  />
                </Motion.div>

                <h2 className="text-2xl font-bold theme-text mb-2">
                  ابدأ بالبحث عن المريض
                </h2>
                <p className="theme-text-muted text-center mb-8">
                  استخدم شريط البحث أدناه للبحث عن سجل المريض باسمه عبر نظام
                  العيادة الموحد
                </p>
              </div>
            )}

            {showSearchResults && (
              <div className="w-full flex items-center gap-2 mb-4 animate-fadeIn">
                <button
                  onClick={handleResetSearch}
                  className="px-4 py-2 rounded-xl theme-surface-80 theme-text hover:theme-surface-95 transition-colors text-sm"
                >
                  ← عودة
                </button>
                <span className="flex-1 theme-text-muted text-sm flex items-center gap-2">
                  {searchResults.length} نتيجة
                  {(isLoading || isFetching) && (
                    <CircularProgress size={14} color="inherit" />
                  )}
                </span>
              </div>
            )}

            <div
              className={`w-full rounded-3xl p-1 theme-gradient-border shadow-lg transition-all duration-300 ${
                !showSearchResults ? "max-w-md" : "max-w-full"
              }`}
            >
              <div className="relative rounded-3xl theme-surface-90">
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={handleSearchChange}
                  placeholder="ابحث باسم المريض المطلوب..."
                  className="w-full rounded-3xl border-0 bg-transparent py-3 pr-12 pl-12 text-sm theme-text outline-none transition-all placeholder:text-(--color-grey)"
                  autoFocus
                />
                <Search
                  className="absolute right-4 top-1/2 -translate-y-1/2 theme-text-muted pointer-events-none"
                  fontSize="small"
                />
              </div>
            </div>
          </div>
        </div>

        {showSearchResults && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {searchResults.length > 0 ? (
              <div className="px-3 sm:px-4 md:px-8 lg:px-10 space-y-2">
                <AnimatePresence mode="popLayout">
                  {searchResults.map((patient) => (
                    <PatientCard
                      key={patient.uuid || patient.id}
                      patient={patient}
                      onClick={handlePatientSelect}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              !isLoading && (
                <Motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <SearchOff
                    sx={{
                      fontSize: 80,
                      color: "var(--color-text-muted)",
                      opacity: 0.2,
                      marginBottom: 2,
                    }}
                  />
                  <p className="theme-text-muted">
                    لم يتم العثور على نتائج تطابق هذا الاسم
                  </p>
                </Motion.div>
              )
            )}
          </Motion.div>
        )}
      </div>
    </div>
  );
};

export default PatientsRecordsPage;