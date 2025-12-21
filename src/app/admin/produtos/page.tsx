import Link from "next/link";
import Image from "next/image";

// Dados de exemplo (virão do Supabase)
const products = [
    {
        id: "1",
        name: "Brinco Gota Ametista",
        slug: "brinco-gota-ametista",
        price: 289.90,
        category: "Brincos",
        stock: 15,
        status: "active",
        image: "/products/brinco-ametista-1.jpg",
    },
    {
        id: "2",
        name: "Colar Ponto de Luz",
        slug: "colar-ponto-de-luz",
        price: 199.90,
        category: "Colares",
        stock: 20,
        status: "active",
        image: "/products/colar-ponto-luz-1.jpg",
    },
    {
        id: "3",
        name: "Anel Quartzo Rosa",
        slug: "anel-quartzo-rosa",
        price: 179.90,
        category: "Anéis",
        stock: 2,
        status: "active",
        image: "/products/anel-quartzo-1.jpg",
    },
    {
        id: "4",
        name: "Pulseira Turmalina",
        slug: "pulseira-turmalina",
        price: 259.90,
        category: "Pulseiras",
        stock: 0,
        status: "inactive",
        image: "/products/pulseira-turmalina-1.jpg",
    },
];

export default function AdminProducts() {
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
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-beige/30">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-12 h-12 bg-beige">
                                                <Image
                                                    src={product.image}
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
                                    <td className="px-6 py-4 text-dark">{product.category}</td>
                                    <td className="px-6 py-4 text-dark">{formatPrice(product.price)}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`${product.stock === 0
                                                    ? "text-red-600"
                                                    : product.stock <= 5
                                                        ? "text-yellow-600"
                                                        : "text-green-600"
                                                }`}
                                        >
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 text-xs rounded ${product.status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {product.status === "active" ? "Ativo" : "Inativo"}
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
                                            <button className="text-red-600 hover:underline text-sm">
                                                Excluir
                                            </button>
                                        </div>
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
