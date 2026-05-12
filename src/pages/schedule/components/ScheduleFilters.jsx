import { FilterAlt, Search } from "@mui/icons-material";
import { motion as Motion } from "framer-motion";

const ScheduleFilters = ({
  searchQuery,
  onSearchChange,
  selectedSpecialty,
  onSpecialtyChange,
  specialtyOptions,
  onResetFilters,
}) => {
  const hasActiveFilters = Boolean(searchQuery || selectedSpecialty);

  return (
    <Motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="rounded-4xl p-px theme-gradient-border shadow-2xl"
    >
      <div className="rounded-4xl theme-surface-90 p-5 md:p-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-bold theme-text">فلترة الجدول</h2>
            <p className="text-sm theme-text-muted">
              الفلترة تعمل محلياً على نفس بيانات البرنامج الأسبوعي.
            </p>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border theme-border theme-surface px-4 py-2 text-sm font-medium theme-text transition-colors theme-hover-surface"
            >
              <FilterAlt fontSize="small" />
              إظهار الكل
            </button>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.8fr)]">
          <label className="relative block">
            <span className="mb-2 block text-sm font-semibold theme-text">
              البحث باسم الطبيب أو العيادة
            </span>
            <div className="relative rounded-3xl border theme-border theme-surface">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="اكتب اسم الطبيب أو العيادة هنا..."
                className="w-full rounded-3xl border-0 bg-transparent py-3 pr-12 pl-4 text-sm theme-text outline-none transition-all placeholder:text-(--color-grey)"
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-muted"
                fontSize="small"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold theme-text">
              فلتر الاختصاص
            </span>
            <div className="relative rounded-3xl border theme-border theme-surface">
              <select
                value={selectedSpecialty}
                onChange={(event) => onSpecialtyChange(event.target.value)}
                className="w-full appearance-none rounded-3xl border-0 bg-transparent py-3 pr-4 pl-12 text-sm theme-text outline-none"
              >
                <option value="">كل الاختصاصات</option>
                {specialtyOptions.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
              <FilterAlt
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 theme-text-muted"
                fontSize="small"
              />
            </div>
          </label>
        </div>
      </div>
    </Motion.section>
  );
};

export default ScheduleFilters;
