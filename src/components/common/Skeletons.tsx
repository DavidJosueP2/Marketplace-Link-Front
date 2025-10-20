/**
 * PublicationSkeleton - Skeleton for publication cards with improved animation
 */
export const PublicationSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
    <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%]"></div>
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-3/4"></div>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%]"
          ></div>
        ))}
      </div>
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-full"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-2/3"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-24"></div>
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-16"></div>
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] flex-1"></div>
        <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-10"></div>
      </div>
    </div>
  </div>
);

/**
 * ProductoSkeleton - Skeleton para tarjetas de productos con animación mejorada
 * @deprecated Use PublicationSkeleton instead
 */
export const ProductoSkeleton = PublicationSkeleton;

/**
 * IncidenceSkeleton - Skeleton for incidents with improved animation
 */
export const IncidenceSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-3">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-3/4"></div>
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-1/2"></div>
      </div>
      <div className="h-6 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%]"></div>
    </div>
    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-full"></div>
    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-5/6"></div>
    <div className="flex justify-between items-center pt-3 border-t dark:border-gray-700">
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-24"></div>
      <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-32"></div>
    </div>
  </div>
);

/**
 * IncidenciaSkeleton - Skeleton para incidencias con animación mejorada
 * @deprecated Use IncidenceSkeleton instead
 */
export const IncidenciaSkeleton = IncidenceSkeleton;

/**
 * StatCardSkeleton - Skeleton para tarjetas de estadísticas
 */
export const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-3"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
      </div>
      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);
