import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Product } from '../types';
import { ProductModal } from './ProductModal';
import {
  Search,
  Wifi,
  Sparkles,
  Clock,
  Plus,
  Flame,
  UtensilsCrossed,
  Sandwich,
  Soup,
  IceCream,
  Wine,
  Leaf,
  Filter,
  Check
} from 'lucide-react';

interface CustomerMenuProps {
  onOpenTableModal: () => void;
}

export const CustomerMenu: React.FC<CustomerMenuProps> = ({ onOpenTableModal }) => {
  const {
    config,
    activeTable,
    categories,
    products,
    addToCart,
    setIsCartOpen
  } = useRestaurant();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedItemAnimation, setAddedItemAnimation] = useState<string | null>(null);

  // Icon map for categories
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'UtensilsCrossed': return UtensilsCrossed;
      case 'Flame': return Flame;
      case 'Sandwich': return Sandwich;
      case 'Soup': return Soup;
      case 'IceCream': return IceCream;
      case 'Wine': return Wine;
      default: return UtensilsCrossed;
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategoryId !== 'all' && p.categoryId !== selectedCategoryId) {
        return false;
      }

      // Tag filter
      if (filterTag === 'vegetariano' && !p.tags?.includes('vegetariano')) {
        return false;
      }
      if (filterTag === 'sem-gluten' && !p.tags?.includes('sem-gluten')) {
        return false;
      }
      if (filterTag === 'destaque' && !p.tags?.includes('destaque') && !p.badge) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        const matchBadge = p.badge?.toLowerCase().includes(query);
        return matchName || matchDesc || matchBadge;
      }

      return true;
    });
  }, [products, selectedCategoryId, filterTag, searchQuery]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (!product.isAvailable) return;

    // If product has complements, open modal to let user choose
    if (product.complements && product.complements.length > 0) {
      setSelectedProduct(product);
      return;
    }

    addToCart(product, 1, [], '');
    setAddedItemAnimation(product.id);
    setTimeout(() => setAddedItemAnimation(null), 1200);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="min-h-screen pb-24">
      
      {/* Restaurant Hero Card */}
      <section className="bg-zinc-900 text-white relative overflow-hidden py-10 px-4 sm:px-6 lg:px-8">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cardápio Digital Interativo</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
                {config.name}
              </h1>
              <p className="text-zinc-300 text-sm sm:text-base mt-1.5 max-w-xl">
                {config.slogan}
              </p>

              {/* Table and Wi-Fi Badges */}
              <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
                <button
                  onClick={onOpenTableModal}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Você está fazendo pedido para: <strong>Mesa {activeTable}</strong></span>
                  <span className="underline ml-1 opacity-80 text-[11px]">(Trocar)</span>
                </button>

                {config.wifiName && (
                  <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-amber-400" />
                    <span>Wi-Fi: <strong>{config.wifiName}</strong> ({config.wifiPassword})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Search */}
            <div className="w-full md:w-80">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar pratos, carnes, bebidas..."
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/90 text-white placeholder-zinc-400 text-sm rounded-xl border border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Categories & Dietary Filters */}
      <section className="sticky top-18 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          
          {/* Categories Pill Nav */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategoryId('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                selectedCategoryId === 'all'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <span>Todos os Pratos</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                selectedCategoryId === 'all' ? 'bg-amber-600 text-white' : 'bg-zinc-200 text-zinc-600'
              }`}>
                {products.length}
              </span>
            </button>

            {categories.map(category => {
              const Icon = getCategoryIcon(category.iconName);
              const isSelected = selectedCategoryId === category.id;
              const count = products.filter(p => p.categoryId === category.id).length;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-xs font-bold'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-amber-600'}`} />
                  <span>{category.name}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isSelected ? 'bg-amber-600 text-white' : 'bg-zinc-200 text-zinc-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub Filters: Diet & Specials */}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-100 text-xs overflow-x-auto">
            <span className="text-zinc-400 flex items-center gap-1 font-medium whitespace-nowrap">
              <Filter className="w-3 h-3" /> Filtros:
            </span>

            {[
              { id: 'all', label: 'Tudo' },
              { id: 'destaque', label: '⭐ Destaques & Mais Vendidos' },
              { id: 'vegetariano', label: '🌱 Opções Vegetarianas' },
              { id: 'sem-gluten', label: '🌾 Sem Glúten' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterTag(f.id)}
                className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  filterTag === f.id
                    ? 'bg-zinc-900 text-white font-semibold shadow-2xs'
                    : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-200/70 border border-zinc-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Main Products Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Results Header */}
        <div className="flex justify-between items-baseline mb-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 font-display">
              {selectedCategoryId === 'all'
                ? 'Cardápio Completo'
                : categories.find(c => c.id === selectedCategoryId)?.name}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {filteredProducts.length} itens encontrados
            </p>
          </div>
        </div>

        {/* Empty Search State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 max-w-md mx-auto my-12 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 mx-auto flex items-center justify-center mb-3">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-zinc-800">Nenhum prato encontrado</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Tente buscar por outro termo ou limpar os filtros de categoria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryId('all');
                setFilterTag('all');
              }}
              className="mt-4 px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-colors"
            >
              Ver Cardápio Completo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => {
              const isAdded = addedItemAnimation === product.id;

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`group bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-amber-300 hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer ${
                    !product.isAvailable ? 'opacity-70 grayscale-30' : ''
                  }`}
                >
                  {/* Photo with badges */}
                  <div className="relative h-48 w-full bg-zinc-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {product.badge && (
                        <span className="px-2.5 py-1 bg-amber-500 text-white text-[11px] font-bold rounded-lg uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {product.badge}
                        </span>
                      )}
                      {!product.isAvailable && (
                        <span className="px-2.5 py-1 bg-red-600 text-white text-[11px] font-bold rounded-lg uppercase tracking-wider shadow-sm">
                          Esgotado
                        </span>
                      )}
                    </div>

                    {/* Preparation time badge */}
                    {product.preparationTimeMinutes && (
                      <div className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        ~{product.preparationTimeMinutes} min
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-zinc-900 group-hover:text-amber-600 transition-colors line-clamp-1 text-base">
                          {product.name}
                        </h3>
                      </div>

                      <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Dietary tags */}
                      {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {product.tags.includes('vegetariano') && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                              <Leaf className="w-2.5 h-2.5" /> Veggie
                            </span>
                          )}
                          {product.tags.includes('sem-gluten') && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 text-[10px] font-semibold">
                              Sem Glúten
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Price and Add Button */}
                    <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-zinc-400 block font-medium">Preço</span>
                        <span className="text-lg font-extrabold text-zinc-900">
                          {formatCurrency(product.price)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        disabled={!product.isAvailable}
                        className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : product.isAvailable
                            ? 'bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-white border border-amber-200 hover:border-amber-500'
                            : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                        }`}
                        title={product.complements?.length ? 'Personalizar e Adicionar' : 'Adicionar 1 ao carrinho'}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Adicionado!</span>
                          </>
                        ) : product.complements && product.complements.length > 0 ? (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Escolher</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Pedir</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating View Cart bar at the bottom for mobile */}
      <div className="fixed bottom-4 left-4 right-4 z-30 max-w-md mx-auto md:hidden">
        <button
          onClick={() => setIsCartOpen(true)}
          className="w-full py-3.5 px-5 bg-zinc-900 hover:bg-black text-white rounded-2xl shadow-xl flex items-center justify-between font-bold text-sm"
        >
          <span className="flex items-center gap-2">
            <span>Ver Pedido da Mesa {activeTable}</span>
          </span>
          <span className="px-2.5 py-1 bg-amber-500 text-white rounded-xl text-xs">
            Abrir
          </span>
        </button>
      </div>

      {/* Detailed Product Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

    </div>
  );
};
