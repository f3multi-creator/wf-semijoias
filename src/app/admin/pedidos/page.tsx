import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Revalidar a cada 30 segundos
export const revalidate = 30;

async function getOrders() {
    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      items:order_items(*)
    `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar pedidos:', error);
        return [];
    }

    return data || [];
}

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    processing: "bg-purple-100 text-purple-800 border-purple-200",
    shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels: Record<string, string> = {
    pending: "Pendente",
    confirmed: "Confirmado",
    processing: "Processando",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
};

const paymentStatusLabels: Record<string, string> = {
    pending: "Aguardando",
    approved: "Aprovado",
    in_process: "Em análise",
    rejected: "Recusado",
    refunded: "Reembolsado",
    cancelled: "Cancelado",
};

export default async function AdminPedidosPage() {
    const orders = await getOrders();

    const formatPrice = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-display text-dark">Pedidos</h1>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <select className="px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold">
                    <option value="">Todos os status</option>
                    <option value="pending">Pendente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="processing">Processando</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregue</option>
                    <option value="cancelled">Cancelado</option>
                </select>
                <select className="px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold">
                    <option value="">Pagamento</option>
                    <option value="approved">Aprovado</option>
                    <option value="pending">Pendente</option>
                    <option value="rejected">Recusado</option>
                </select>
            </div>

            {/* Orders Table */}
            <div className="bg-cream border border-beige overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-beige/50">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Pedido</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Cliente</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Itens</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Total</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Pagamento</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Data</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-beige">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-taupe">
                                        Nenhum pedido ainda. Os pedidos aparecerão aqui após a primeira compra.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-beige/30">
                                        <td className="px-6 py-4">
                                            <span className="text-dark font-medium">#{order.order_number}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-dark">{order.customer_name || '-'}</p>
                                                <p className="text-taupe text-xs">{order.customer_email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-dark">
                                            {order.items?.length || 0} item(s)
                                        </td>
                                        <td className="px-6 py-4 text-dark font-medium">
                                            {formatPrice(order.total)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded ${order.payment_status === 'approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : order.payment_status === 'rejected'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {paymentStatusLabels[order.payment_status] || order.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded border ${statusColors[order.status] || 'bg-gray-100'}`}>
                                                {statusLabels[order.status] || order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-taupe text-sm">
                                            {formatDate(order.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/pedidos/${order.id}`}
                                                className="text-gold hover:underline text-sm"
                                            >
                                                Ver detalhes
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
