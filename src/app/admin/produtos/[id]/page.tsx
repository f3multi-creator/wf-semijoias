import { ProductForm } from "@/components/admin/ProductForm";

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;

    return (
        <div>
            <h1 className="text-2xl font-display text-dark mb-8">Editar Produto</h1>
            <ProductForm productId={id} />
        </div>
    );
}
