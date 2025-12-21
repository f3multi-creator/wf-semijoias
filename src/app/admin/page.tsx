import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Revalidar a cada 30 segundos
export const revalidate = 30;

async function getDashboardStats() {
    // Total de vendas (pedidos aprovados)
    const { data: ordersApproved } = await supabase
        .from('orders')
        .select('total')
        .eq('payment_status', 'approved');

    const totalSales = ordersApproved?.reduce((sum, o) => sum + o.total, 0) || 0;

    // Pedidos de hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: ordersToday } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

    // Pedidos pendentes (aguardando envio)
    const { count: pendingOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'confirmed')
        .neq('status', 'shipped');

    // Produtos com estoque baixo
    const { count: lowStockProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .lte('stock_quantity', 5);

    return {
        totalSales,
        ordersToday: ordersToday || 0,
        pendingOrders: pendingOrders || 0,
        lowStockProducts: lowStockProducts || 0,
    };
}

async function getRecentOrders() {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Erro ao buscar pedidos:', error);
        return [];
    }

    return data || [];
}

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
    pending: "Pendente",
    confirmed: "Confirmado",
    processing: "Processando",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
};

export default async function AdminDashboard() {
    const [stats, recentOrders] = await Promise.all([
        getDashboardStats(),
        getRecentOrders(),
    ]);

    const formatPrice = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const formatDate = (date: string) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now.getTime() - d.getTime();

        if (diff < 86400000) { // menos de 24h
            return `Hoje, ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diff < 172800000) { // menos de 48h
            return `Ontem, ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        }
        return d.toLocaleDateString('pt-BR');
    };

    return (
        <div>
            <h1 className="text-2xl font-display text-dark mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-cream p-6 border border-beige">
                    <p className="text-taupe text-sm mb-1">Vendas (Aprovadas)</p>
                    <p className="text-2xl font-display text-dark">{formatPrice(stats.totalSales)}</p>
                </div>
                <div className="bg-cream p-6 border border-beige">
                    <p className="text-taupe text-sm mb-1">Pedidos Hoje</p>
                    <p className="text-2xl font-display text-dark">{stats.ordersToday}</p>
                </div>
                <div className="bg-cream p-6 border border-beige">
                    <p className="text-taupe text-sm mb-1">Aguardando Envio</p>
                    <p className="text-2xl font-display text-gold">{stats.pendingOrders}</p>
                </div>
                <div className="bg-cream p-6 border border-beige">
                    <p className="text-taupe text-sm mb-1">Estoque Baixo</p>
                    <p className={`text-2xl font-display ${stats.lowStockProducts > 0 ? 'text-red-600' : 'text-dark'}`}>
                        {stats.lowStockProducts}
                    </p>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-cream border border-beige">
                <div className="flex items-center justify-between p-6 border-b border-beige">
                    <h2 className="font-display text-xl text-dark">Pedidos Recentes</h2>
                    <Link href="/admin/pedidos" className="text-gold hover:underline text-sm">
                        Ver todos →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-beige/50">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Pedido</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Cliente</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Total</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Data</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-beige">
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-taupe">
                                        Nenhum pedido ainda. Após o primeiro pedido, ele aparecerá aqui.
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-beige/30">
                                        <td className="px-6 py-4 text-dark">#{order.order_number}</td>
                                        <td className="px-6 py-4 text-dark">{order.customer_name || order.customer_email}</td>
                                        <td className="px-6 py-4 text-dark">{formatPrice(order.total)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded ${statusColors[order.status] || 'bg-gray-100'}`}>
                                                {statusLabels[order.status] || order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-taupe text-sm">{formatDate(order.created_at)}</td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/pedidos/${order.id}`}
                                                className="text-gold hover:underline text-sm"
                                            >
                                                Ver
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
