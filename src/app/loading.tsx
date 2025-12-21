export default function Loading() {
    return (
        <div className="min-h-screen bg-cream">
            {/* Hero Skeleton */}
            <div className="h-[60vh] bg-beige/50 animate-pulse" />

            {/* Categories Skeleton */}
            <div className="py-16 bg-cream">
                <div className="container">
                    <div className="h-8 w-48 bg-beige/50 mx-auto mb-8 animate-pulse rounded" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-beige/50 animate-pulse rounded" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Skeleton */}
            <div className="py-16 bg-offwhite">
                <div className="container">
                    <div className="h-8 w-48 bg-beige/50 mb-8 animate-pulse rounded" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <div className="aspect-square bg-beige/50 animate-pulse rounded" />
                                <div className="h-4 w-3/4 bg-beige/50 animate-pulse rounded" />
                                <div className="h-4 w-1/2 bg-beige/50 animate-pulse rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
