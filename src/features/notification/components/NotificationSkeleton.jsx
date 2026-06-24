const NotificationSkeleton = () => (
  <div className="p-6 max-w-4xl mx-auto space-y-3" dir="rtl">
    <div className="h-12 w-48 theme-border bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse mb-6" />
    {[1, 2, 3].map((n) => (
      <div
        key={n}
        className="flex items-start gap-4 p-4 rounded-2xl border theme-border theme-surface-90 animate-pulse"
      >
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-slate-800 shrink-0" />
        <div className="flex-1 space-y-2.5 py-1">
          <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-md w-1/4" />
          <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded-md w-3/4" />
          <div className="h-2 bg-gray-200 dark:bg-slate-800 rounded-md w-16" />
        </div>
      </div>
    ))}
  </div>
);

export default NotificationSkeleton;