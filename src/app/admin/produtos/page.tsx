import Link from "next/link";
import Image from "next/image";

// Revalidar a cada requisição (sem cache)
export const revalidate = 0;

async function getAdminProducts() {
    // Usar API interna com service role para garantir dados atualizados
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';

    try {
        const response = await fetch(`${baseUrl}/api/admin/products`, {
            cache: 'no-store', // Força busca atualizada
        });

        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Erro ao buscar produtos via API:', error);
    }

    return [];
}

export default async function AdminProducts() {
    const products = await getAdminProducts();

    const formatPrice = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-display text-dark">Produtos</h1>
                <Link href="/admin/produtos/novo" className="btn btn-primary">
                    + Novo Produto
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Buscar produtos..."
                    className="px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold"
                />
                <select className="px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold">
                    <option value="">Todas as categorias</option>
                    <option value="brincos">Brincos</option>
                    <option value="colares">Colares</option>
                    <option value="aneis">Anéis</option>
                    <option value="pulseiras">Pulseiras</option>
                </select>
                <select className="px-4 py-2 border border-beige bg-cream focus:outline-none focus:border-gold">
                    <option value="">Todos os status</option>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                </select>
            </div>

            {/* Products Table */}
            <div className="bg-cream border border-beige overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-beige/50">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Produto</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Categoria</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Preço</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Estoque</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-3 text-xs text-taupe uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-beige">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-taupe">
                                        Nenhum produto cadastrado ainda.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product: any) => {
                                    const primaryImage = product.images?.find((img: any) => img.is_primary)?.url
                                        || product.images?.[0]?.url
                                        || "/products/brinco-ametista-1.jpg";

                                    return (
                                        <tr key={product.id} className="hover:bg-beige/30">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-12 h-12 bg-beige">
                                                        <Image
                                                            src={primaryImage}
                                                            alt={product.name}
                                                            fill
                                                            sizes="48px"
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-dark font-medium">{product.name}</p>
                                                        <p className="text-taupe text-xs">/{product.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-dark">{product.category?.name || '-'}</td>
                                            <td className="px-6 py-4 text-dark">{formatPrice(product.price)}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`${product.stock_quantity === 0
                                                        ? "text-red-600"
                                                        : product.stock_quantity <= (product.low_stock_threshold || 5)
                                                            ? "text-yellow-600"
                                                            : "text-green-600"
                                                        }`}
                                                >
                                                    {product.stock_quantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded ${product.is_active
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {product.is_active ? "Ativo" : "Inativo"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/admin/produtos/${product.id}`}
                                                        className="text-gold hover:underline text-sm"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <Link
                                                        href={`/produto/${product.slug}`}
                                                        target="_blank"
                                                        className="text-taupe hover:underline text-sm"
                                                    >
                                                        Ver
                                                    </Link>
                                                </div>
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
