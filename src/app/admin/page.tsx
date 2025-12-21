import Link from "next/link";

// Dados de exemplo (virão do Supabase)
const stats = {
    totalSales: 12450.90,
    ordersToday: 5,
    pendingOrders: 3,
    lowStockProducts: 2,
};

const recentOrders = [
    { id: "001", customer: "Maria Silva", total: 289.90, status: "pending", date: "Hoje, 14:30" },
    { id: "002", customer: "Ana Costa", total: 459.80, status: "approved", date: "Hoje, 12:15" },
    { id: "003", customer: "Julia Santos", total: 179.90, status: "shipped", date: "Ontem, 18:00" },
    { id: "004", customer: "Carla Oliveira", total: 549.70, status: "delivered", date: "Ontem, 10:30" },
];

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
    pending: "Pendente",
    approved: "Aprovado",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
};

export default function AdminDashboard() {
    const formatPrice = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    return (
        <div>
            <h1 className="text-2xl font-display text-dark mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-cream p-6 border border-beige">
                    <p className="text-taupe text-sm mb-1">Vendas Hoje</p>
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
                    <p className="text-2xl font-display text-red-600">{stats.lowStockProducts}</p>
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
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-beige/30">
                                    <td className="px-6 py-4 text-dark">#{order.id}</td>
                                    <td className="px-6 py-4 text-dark">{order.customer}</td>
                                    <td className="px-6 py-4 text-dark">{formatPrice(order.total)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded ${statusColors[order.status]}`}>
                                            {statusLabels[order.status]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-taupe text-sm">{order.date}</td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/admin/pedidos/${order.id}`}
                                            className="text-gold hover:underline text-sm"
                                        >
                                            Ver
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
