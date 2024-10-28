import { Skeleton } from "@/components/ui/skeleton"

export function StudentSkeleton() {
  return (
    <div className="flex flex-col space-y-3 gap-4">
      <div className="flex gap-6">
        <Skeleton className="h-[50px] w-1/5 rounded-xl" />
        <Skeleton className="h-[50px] w-2/5 rounded-xl" />
        <Skeleton className="h-[50px] w-1/4 rounded-xl" />
      </div>
    </div>
  )
}
