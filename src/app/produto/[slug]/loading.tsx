export default function ProductLoading() {
    return (
        <div className="min-h-screen bg-cream">
            {/* Breadcrumb Skeleton */}
            <div className="py-4 bg-beige/50">
                <div className="container">
                    <div className="h-4 w-48 bg-beige animate-pulse rounded" />
                </div>
            </div>

            {/* Product Section */}
            <section className="py-16">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Gallery Skeleton */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-beige/50 animate-pulse rounded" />
                            <div className="flex gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-20 h-20 bg-beige/50 animate-pulse rounded" />
                                ))}
                            </div>
                        </div>

                        {/* Info Skeleton */}
                        <div className="space-y-6">
                            <div className="h-4 w-24 bg-beige/50 animate-pulse rounded" />
                            <div className="h-10 w-3/4 bg-beige/50 animate-pulse rounded" />
                            <div className="h-8 w-32 bg-beige/50 animate-pulse rounded" />
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-beige/50 animate-pulse rounded" />
                                <div className="h-4 w-full bg-beige/50 animate-pulse rounded" />
                                <div className="h-4 w-2/3 bg-beige/50 animate-pulse rounded" />
                            </div>
                            <div className="h-12 w-full bg-beige/50 animate-pulse rounded" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
