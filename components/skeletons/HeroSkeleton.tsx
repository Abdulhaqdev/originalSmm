import { Skeleton } from "../ui/skeleton";

export default function HeroSkeleton() {
  return (
    <section className="pt-24 pb-12 bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4 text-center">
        <Skeleton className="h-12 w-96 mx-auto mb-4" />
        <Skeleton className="h-8 w-72 mx-auto mb-6" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
    </section>
  )
}