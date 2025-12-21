import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Revalidar a cada 60 segundos
export const revalidate = 60;

async function getCoupons() {
    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar cupons:', error);
        return [];
    }

    return data || [];
}

export default async function AdminCuponsPage() {
    const coupons = await getCoupons();

    const formatPrice = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const formatDate = (date: string | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString("pt-BR");
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-display text-dark">Cupons</h1>
                <Link href="/admin/cupons/novo" className="btn btn-primary">
                    + Novo Cupom
                </Link>
            </div>

            {/* Coupons Table */}
            <div className="bg-cream border border-beige overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-beige/50">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Código</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Desconto</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Usos</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Validade</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-beige">
                            {coupons.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-taupe">
                                        Nenhum cupom cadastrado ainda.
                                    </td>
                                </tr>
                            ) : (
                                coupons.map((coupon: any) => {
                                    const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
                                    const isExhausted = coupon.max_uses && coupon.uses_count >= coupon.max_uses;

                                    return (
                                        <tr key={coupon.id} className="hover:bg-beige/30">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-dark font-medium">{coupon.code}</span>
                                            </td>
                                            <td className="px-6 py-4 text-dark">
                                                {coupon.discount_type === 'percentage'
                                                    ? `${coupon.discount_value}%`
                                                    : coupon.discount_type === 'free_shipping'
                                                        ? 'Frete Grátis'
                                                        : formatPrice(coupon.discount_value)
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-dark">
                                                {coupon.uses_count || 0}
                                                {coupon.max_uses && ` / ${coupon.max_uses}`}
                                            </td>
                                            <td className="px-6 py-4 text-taupe text-sm">
                                                {coupon.expires_at
                                                    ? formatDate(coupon.expires_at)
                                                    : 'Sem validade'
                                                }
                                            </td>
                                            <td className="px-6 py-4">
                                                {!coupon.is_active ? (
                                                    <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                                                        Inativo
                                                    </span>
                                                ) : isExpired ? (
                                                    <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                                                        Expirado
                                                    </span>
                                                ) : isExhausted ? (
                                                    <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                                                        Esgotado
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                                                        Ativo
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/admin/cupons/${coupon.id}`}
                                                    className="text-gold hover:underline text-sm"
                                                >
                                                    Editar
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
