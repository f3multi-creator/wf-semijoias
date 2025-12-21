import { CouponForm } from "@/components/admin/CouponForm";

interface EditCouponPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCouponPage({ params }: EditCouponPageProps) {
    const { id } = await params;

    return (
        <div>
            <h1 className="text-2xl font-display text-dark mb-8">Editar Cupom</h1>
            <CouponForm couponId={id} />
        </div>
    );
}
