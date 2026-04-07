import { useState, useEffect, useRef } from "react";
import marmitexPequena from "@/assets/marmitex-pequena.jpg";
import marmitexGrande from "@/assets/marmitex-grande.jpg";
import kitFamilia from "@/assets/kit-familia.jpg";
import marmitexMilanesa from "@/assets/marmitex-milanesa.jpg";
import marmitexStrogonoff from "@/assets/marmitex-strogonoff.jpg";
import marmitexCostela from "@/assets/marmitex-costela.jpg";
import marmitexFeijoada from "@/assets/marmitex-feijoada.jpg";
import marmitexParmegiana from "@/assets/marmitex-parmegiana.jpg";

interface Product {
  name: string;
  image: string;
  oldPrice: string;
  newPrice: string;
  category: string;
  isBestSeller?: boolean;
}

const products: Product[] = [
  { name: "Marmitex Pequena Com Churrasco", image: marmitexPequena, oldPrice: "R$ 39,90", newPrice: "R$ 23,90", category: "promos" },
  { name: "Marmitex Grande Com Churrasco", image: marmitexGrande, oldPrice: "R$ 43,80", newPrice: "R$ 28,90", category: "promos" },
  { name: "Kit Familia 3 Marmitex Grande", image: kitFamilia, oldPrice: "R$ 69,90", newPrice: "R$ 54,90", category: "promos", isBestSeller: true },
  { name: "Marmitex Grande Com Bife Milanesa", image: marmitexMilanesa, oldPrice: "R$ 39,80", newPrice: "R$ 23,90", category: "promos" },
  { name: "Marmitex Grande Com Strogonoff", image: marmitexStrogonoff, oldPrice: "R$ 39,80", newPrice: "R$ 25,90", category: "churrasco" },
  { name: "Marmitex Grande de Costela Assada", image: marmitexCostela, oldPrice: "R$ 39,80", newPrice: "R$ 29,90", category: "churrasco", isBestSeller: true },
  { name: "Marmitex Grande de Feijoada", image: marmitexFeijoada, oldPrice: "R$ 39,80", newPrice: "R$ 32,90", category: "tradicionais" },
  { name: "Marmitex Grande Bife Parmegiana", image: marmitexParmegiana, oldPrice: "R$ 39,80", newPrice: "R$ 29,90", category: "tradicionais" },
];

const categories = [
  { id: "promos", label: "🔥 Promoções" },
  { id: "churrasco", label: "🥩 Churrasco" },
  { id: "tradicionais", label: "🍛 Tradicionais" },
  { id: "todos", label: "📋 Todos" },
];

const ProductList = () => {
  const [activeCategory, setActiveCategory] = useState("promos");
  const [stock, setStock] = useState(8);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setStock((prev) => (prev > 1 ? prev - 1 : 1));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    if (catId === "todos") {
      // scroll to first section
      const first = sectionRefs.current["promos"];
      first?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const el = sectionRefs.current[catId];
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const filtered = activeCategory === "todos" ? products : products.filter((p) => p.category === activeCategory);

  const groupedByCategory = activeCategory === "todos"
    ? categories.filter(c => c.id !== "todos").map(c => ({
        ...c,
        products: products.filter(p => p.category === c.id),
      })).filter(g => g.products.length > 0)
    : [{ id: activeCategory, label: categories.find(c => c.id === activeCategory)?.label || "", products: filtered }];

  return (
    <main className="container mt-2 pb-4">
      {/* Alerts */}
      <div className="bg-secondary rounded-xl p-3 text-center text-sm mb-2">
        <b>Entrega Grátis</b> para <b>sua região</b>!
      </div>
      <div className="bg-secondary rounded-xl p-3 text-center text-sm text-primary mb-4">
        Aproveite nossa promoção com preços irresistíveis 💜
      </div>

      {/* Horizontal scrollable categories */}
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide mb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all flex-shrink-0 ${
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products vertical list */}
      {groupedByCategory.map((group) => (
        <div
          key={group.id}
          ref={(el) => { sectionRefs.current[group.id] = el; }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold text-primary mb-3">{group.label}</h2>
          <div className="flex flex-col gap-3">
            {group.products.map((product, i) => (
              <ProductItem key={i} product={product} stock={stock} />
            ))}
          </div>
        </div>
      ))}
    </main>
  );
};

const ProductItem = ({ product, stock }: { product: Product; stock: number }) => {
  if (product.isBestSeller) {
    return (
      <a href="#" className="flex flex-col rounded-2xl border-2 border-success p-3 animate-pulse-green product-card">
        <div className="w-full aspect-video rounded-xl overflow-hidden border border-border mb-2">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <h3 className="text-sm font-bold text-foreground">{product.name}</h3>
        <span className="text-xs text-success mt-0.5">Frete Grátis</span>
        <div className="text-sm mt-1">
          de <span className="text-price-old">{product.oldPrice}</span> por
        </div>
        <span className="mt-0.5">
          <b className="bg-success text-success-foreground rounded-lg px-1.5 py-0.5 text-lg">{product.newPrice}</b>
        </span>
        <span className="badge-stock mt-1.5">
          🔥 Apenas{" "}
          <b className="bg-destructive text-destructive-foreground rounded-lg px-1.5 py-0.5">{stock} unidade(s)</b>{" "}
          com esse preço
        </span>
      </a>
    );
  }

  return (
    <a href="#" className="flex items-center gap-3 rounded-2xl p-2 product-card">
      <div className="w-24 h-24 rounded-xl overflow-hidden border border-border flex-shrink-0">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground">{product.name}</h3>
        <span className="text-xs text-success mt-0.5">Frete Grátis</span>
        <div className="text-xs mt-1">
          de <span className="text-price-old">{product.oldPrice}</span> por
        </div>
        <span className="text-price">{product.newPrice}</span>
      </div>
    </a>
  );
};

export default ProductList;
