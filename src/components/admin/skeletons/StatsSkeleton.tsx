import { Skeleton } from "@/components/ui/skeleton"

export function StatsSkeleton() {
  return (
    <div className="flex flex-col space-y-3 gap-4">
      <div className="flex gap-6">
        <Skeleton className="h-[125px] w-1/4 rounded-xl" />
        <Skeleton className="h-[125px] w-1/4 rounded-xl" />
        <Skeleton className="h-[125px] w-1/4 rounded-xl" />
        <Skeleton className="h-[125px] w-1/4 rounded-xl" />
      </div>
      <div className="flex gap-6">
        <Skeleton className="h-[60vh] w-4/5 rounded-xl" />
        <Skeleton className="h-[60vh] w-4/5 rounded-xl" />
      </div>
    </div>
  )
}
