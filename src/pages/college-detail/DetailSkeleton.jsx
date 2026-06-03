export default function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="skeleton h-56 lg:h-72 w-full" />
      <div className="bg-white border-b border-slate-200 px-6 py-6">
        <div className="container-xl">
          <div className="flex gap-6 items-start">
            <div className="skeleton w-24 h-24 rounded-xl" />
            <div className="flex-1 space-y-3 pt-2">
              <div className="skeleton h-6 w-64 rounded" />
              <div className="skeleton h-4 w-48 rounded" />
              <div className="skeleton h-4 w-80 rounded" />
            </div>
          </div>
        </div>
      </div>
      <div className="container-xl mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="skeleton h-48 rounded-xl" />
          <div className="skeleton h-32 rounded-xl" />
        </div>
        <div className="skeleton h-80 rounded-xl" />
      </div>
    </div>
  );
}
