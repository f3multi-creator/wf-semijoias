import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { OrderDetails } from "@/components/admin/OrderDetails";

interface OrderPageProps {
    params: Promise<{ id: string }>;
}

async function getOrder(id: string) {
    const { data, error } = await supabase
        .from("orders")
        .select(`
      *,
      items:order_items(*)
    `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("Erro ao buscar pedido:", error);
        return null;
    }

    return data;
}

export default async function AdminOrderPage({ params }: OrderPageProps) {
    const { id } = await params;
    const order = await getOrder(id);

    if (!order) {
        notFound();
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/pedidos" className="text-taupe hover:text-gold">
                    ← Voltar
                </Link>
                <h1 className="text-2xl font-display text-dark">
                    Pedido #{order.order_number}
                </h1>
            </div>

            <OrderDetails order={order} />
        </div>
    );
}
