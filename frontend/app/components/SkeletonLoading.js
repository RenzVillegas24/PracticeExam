'use client';

export function BookingDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Skeleton */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-8 space-y-6">
              {/* Header */}
              <div>
                <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <div className="h-3 w-12 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-3 w-12 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-200 pt-6">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Attachments */}
              <div className="border-t border-gray-200 pt-6">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Messages Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="card p-6 h-full flex flex-col">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>
              
              {/* Messages list */}
              <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="space-y-3">
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookingsListSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-6 space-y-4">
              <div>
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="h-3 w-12 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
