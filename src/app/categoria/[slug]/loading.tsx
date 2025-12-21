export default function CategoryLoading() {
    return (
        <div className="min-h-screen bg-cream">
            {/* Breadcrumb */}
            <div className="py-4 bg-beige/50">
                <div className="container">
                    <div className="h-4 w-32 bg-beige animate-pulse rounded" />
                </div>
            </div>

            {/* Header */}
            <section className="py-16">
                <div className="container">
                    <div className="text-center mb-12">
                        <div className="h-12 w-48 bg-beige/50 mx-auto mb-4 animate-pulse rounded" />
                        <div className="h-4 w-64 bg-beige/50 mx-auto animate-pulse rounded" />
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <div className="aspect-square bg-beige/50 animate-pulse rounded" />
                                <div className="h-4 w-3/4 bg-beige/50 animate-pulse rounded" />
                                <div className="h-4 w-1/2 bg-beige/50 animate-pulse rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
