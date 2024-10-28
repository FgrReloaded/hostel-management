import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const OverViewSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3 gap-4">
      <Skeleton className="h-12 w-full rounded-xl" />
    <div className="flex">
      <Skeleton className="h-[50vh] w-full rounded-xl" />
    </div>
    <div className="flex gap-6">
      <Skeleton className="h-[30vh] w-4/5 rounded-xl" />
      <Skeleton className="h-[30vh] w-4/5 rounded-xl" />
    </div>
  </div>  )
}

export default OverViewSkeleton