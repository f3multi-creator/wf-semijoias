import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
    return (
        <div>
            <h1 className="text-2xl font-display text-dark mb-8">Novo Produto</h1>
            <ProductForm />
        </div>
    );
}
