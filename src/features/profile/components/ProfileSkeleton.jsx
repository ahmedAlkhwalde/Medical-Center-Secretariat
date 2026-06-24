const ProfileSkeleton = () => (
  <section className="w-full min-w-0 space-y-6">
    <div className="overflow-hidden rounded-3xl border theme-border theme-surface-90 p-4 sm:p-6 animate-pulse">
      <div className="h-6 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700 mb-2" />
      <div className="h-4 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-3xl border theme-border theme-surface p-6 animate-pulse">
        <div className="mx-auto w-40 h-40 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 h-5 w-24 mx-auto rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mt-2 h-4 w-32 mx-auto rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="lg:col-span-2 rounded-3xl border theme-border theme-surface p-6 animate-pulse space-y-5">
        <div className="grid grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx}>
              <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700 mb-2" />
              <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="h-10 w-24 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-10 w-24 rounded-xl bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  </section>
);

export default ProfileSkeleton;