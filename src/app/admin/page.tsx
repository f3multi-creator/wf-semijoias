import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

// Revalidar a cada requisição
export const revalidate = 0;

function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!url || !key) return null;
    return createClient(url, key);
}

async function getDashboardData() {
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    // Buscar dados em paralelo
    const [ordersResult, productsResult, categoriesResult] = await Promise.all([
        supabase.from("orders").select("id, total, status, created_at"),
        supabase.from("products").select("id, stock_quantity, is_active"),
        supabase.from("categories").select("id"),
    ]);

    const orders = ordersResult.data || [];
    const products = productsResult.data || [];

    // Calcular métricas
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const averageTicket = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Pedidos por status
    const ordersByStatus = orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Vendas dos últimos 7 dias
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const recentOrders = orders.filter(o => new Date(o.created_at) >= last7Days);
    const recentRevenue = recentOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Produtos com estoque baixo
    const lowStockProducts = products.filter(p => p.stock_quantity <= 5 && p.stock_quantity > 0);
    const outOfStockProducts = products.filter(p => p.stock_quantity === 0);
    const activeProducts = products.filter(p => p.is_active);

    return {
        totalOrders: orders.length,
        totalRevenue,
        averageTicket,
        recentOrders: recentOrders.length,
        recentRevenue,
        ordersByStatus,
        totalProducts: products.length,
        activeProducts: activeProducts.length,
        lowStockProducts: lowStockProducts.length,
        outOfStockProducts: outOfStockProducts.length,
    };
}

export default async function AdminDashboard() {
    const data = await getDashboardData();

    const formatPrice = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    if (!data) {
        return (
            <div className="text-center py-12 text-gray-500">
                Erro ao carregar dados do dashboard
            </div>
        );
    }

    const statusLabels: Record<string, string> = {
        pending: "Pendentes",
        paid: "Pagos",
        processing: "Processando",
        shipped: "Enviados",
        delivered: "Entregues",
        cancelled: "Cancelados",
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard</h1>

            {/* Cards principais */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <p className="text-sm text-gray-500 mb-1">Receita Total</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatPrice(data.totalRevenue)}</p>
                    <p className="text-xs text-gray-400 mt-1">{data.totalOrders} pedidos</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <p className="text-sm text-gray-500 mb-1">Últimos 7 dias</p>
                    <p className="text-2xl font-semibold text-green-600">{formatPrice(data.recentRevenue)}</p>
                    <p className="text-xs text-gray-400 mt-1">{data.recentOrders} pedidos</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <p className="text-sm text-gray-500 mb-1">Ticket Médio</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatPrice(data.averageTicket)}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <p className="text-sm text-gray-500 mb-1">Produtos Ativos</p>
                    <p className="text-2xl font-semibold text-gray-900">{data.activeProducts}</p>
                    <p className="text-xs text-gray-400 mt-1">de {data.totalProducts} total</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Pedidos por status */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Pedidos por Status</h2>
                    <div className="space-y-3">
                        {Object.entries(data.ordersByStatus).map(([status, count]) => (
                            <div key={status} className="flex justify-between items-center">
                                <span className="text-gray-600">{statusLabels[status] || status}</span>
                                <span className="font-medium text-gray-900">{count as number}</span>
                            </div>
                        ))}
                        {Object.keys(data.ordersByStatus).length === 0 && (
                            <p className="text-gray-400 text-sm">Nenhum pedido ainda</p>
                        )}
                    </div>
                    <Link
                        href="/admin/pedidos"
                        className="block text-center mt-4 text-amber-600 hover:text-amber-700 text-sm font-medium"
                    >
                        Ver todos os pedidos →
                    </Link>
                </div>

                {/* Alertas de estoque */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Alertas de Estoque</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-amber-600">Estoque baixo (≤5)</span>
                            <span className="font-medium text-amber-600">{data.lowStockProducts}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-red-600">Sem estoque</span>
                            <span className="font-medium text-red-600">{data.outOfStockProducts}</span>
                        </div>
                    </div>
                    <Link
                        href="/admin/produtos"
                        className="block text-center mt-4 text-amber-600 hover:text-amber-700 text-sm font-medium"
                    >
                        Ver produtos →
                    </Link>
                </div>
            </div>

            {/* Ações Rápidas */}
            <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h2>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/admin/produtos/novo"
                        className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 font-medium text-sm"
                    >
                        + Novo Produto
                    </Link>
                    <Link
                        href="/admin/cupons"
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium text-sm"
                    >
                        Gerenciar Cupons
                    </Link>
                    <Link
                        href="/admin/configuracoes"
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium text-sm"
                    >
                        Configurar Frete
                    </Link>
                </div>
            </div>
        </div>
    );
}
