import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-8 pt-48 pb-20">
      {/* Header */}
      <div className="mb-12">
        <Skeleton className="h-10 w-80 mb-4" />
        <Skeleton className="h-5 w-48" />
      </div>

      <div className="grid lg:grid-cols-[420px_1fr] gap-8">
        {/* Create Project Card */}
        <div className="sticky top-48 self-start">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <Skeleton className="h-8 w-52 mb-8" />

            <Skeleton className="h-12 w-full mb-4" />

            <Skeleton className="h-32 w-full mb-4" />

            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-3xl border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-2xl" />

                <div className="flex-1">
                  <Skeleton className="h-6 w-48 mb-3" />
                  <Skeleton className="h-4 w-full max-w-md" />
                </div>

                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}