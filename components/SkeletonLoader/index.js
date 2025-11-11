import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
        {/* Imagen Skeleton */}
        <div className="lg:col-span-2">
          <div className="w-full h-96 bg-gray-300 dark:bg-gray-700 rounded-lg" />
        </div>

        {/* Contenido Skeleton */}
        <div className="lg:col-span-1">
          {/* Título */}
          <div className="space-y-3">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-4/5" />
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/5" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/5" />
          </div>

          {/* Detalles */}
          <div className="mt-6 space-y-3">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
            </div>
          </div>

          {/* Link */}
          <div className="mt-6">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
          </div>

          {/* Botón atrás */}
          <div className="mt-6">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
