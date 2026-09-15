import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Product, Category, Complement } from '../types';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  Image as ImageIcon,
  Clock,
  DollarSign,
  Layers,
  Search,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';

// Preset curated appetizing food photos for 1-click convenience
const SAMPLE_FOOD_PHOTOS = [
  { name: 'Parrilla / Carnes', url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80' },
  { name: 'Burger Artesanal', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
  { name: 'Petisco / Porção', url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80' },
  { name: 'Massa / Nhoque', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80' },
  { name: 'Risoto de Cogumelos', url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sobremesa Chocolate', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Cheesecake Frutas', url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80' },
  { name: 'Drink / Gin Tônica', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Cerveja Artesanal', url: 'https://images.unsplash.com/photo-1608270199042-30238d21213f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Suco Natural', url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80' },
];

export const MenuEditorView: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    addCategory,
    updateCategory,
    deleteCategory
  } = useRestaurant();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');

  // Product Modal (Add or Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]?.id || '');
  const [formImage, setFormImage] = useState(SAMPLE_FOOD_PHOTOS[0].url);
  const [formBadge, setFormBadge] = useState('');
  const [formPrepTime, setFormPrepTime] = useState('15');
  const [formVegetarian, setFormVegetarian] = useState(false);
  const [formGlutenFree, setFormGlutenFree] = useState(false);
  const [formComplements, setFormComplements] = useState<Complement[]>([]);
  const [newCompName, setNewCompName] = useState('');
  const [newCompPrice, setNewCompPrice] = useState('');

  // Category Manager Modal / inline
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormDescription('');
    setFormPrice('');
    setFormCategory(categories[0]?.id || '');
    setFormImage(SAMPLE_FOOD_PHOTOS[0].url);
    setFormBadge('');
    setFormPrepTime('15');
    setFormVegetarian(false);
    setFormGlutenFree(false);
    setFormComplements([]);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormDescription(prod.description);
    setFormPrice(String(prod.price));
    setFormCategory(prod.categoryId);
    setFormImage(prod.image);
    setFormBadge(prod.badge || '');
    setFormPrepTime(String(prod.preparationTimeMinutes || 15));
    setFormVegetarian(Boolean(prod.tags?.includes('vegetariano')));
    setFormGlutenFree(Boolean(prod.tags?.includes('sem-gluten')));
    setFormComplements(prod.complements ? [...prod.complements] : []);
    setIsProductModalOpen(true);
  };

  const handleAddComplement = () => {
    if (!newCompName.trim()) return;
    const priceNum = parseFloat(newCompPrice.replace(',', '.')) || 0;
    setFormComplements(prev => [
      ...prev,
      { id: `comp-${Date.now()}-${Math.random()}`, name: newCompName.trim(), price: priceNum }
    ]);
    setNewCompName('');
    setNewCompPrice('');
  };

  const handleRemoveComplement = (id: string) => {
    setFormComplements(prev => prev.filter(c => c.id !== id));
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) return;

    const price = parseFloat(formPrice.replace(',', '.')) || 0;
    const prepTime = parseInt(formPrepTime, 10) || 15;

    const tags: string[] = [];
    if (formVegetarian) tags.push('vegetariano');
    if (formGlutenFree) tags.push('sem-gluten');
    if (formBadge) tags.push('destaque');

    const productPayload: Omit<Product, 'id'> = {
      name: formName.trim(),
      description: formDescription.trim(),
      price,
      categoryId: formCategory,
      image: formImage || SAMPLE_FOOD_PHOTOS[0].url,
      isAvailable: editingProduct ? editingProduct.isAvailable : true,
      badge: formBadge.trim() || undefined,
      preparationTimeMinutes: prepTime,
      tags,
      complements: formComplements
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsProductModalOpen(false);
  };

  const filteredProducts = products.filter(p => {
    if (selectedCategoryTab !== 'all' && p.categoryId !== selectedCategoryTab) {
      return false;
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Gestão do Cardápio</span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 font-display">
            Editor de Categorias & Produtos
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Adicione novos pratos, altere fotos, atualize preços e controle a disponibilidade em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Gerenciar Categorias ({categories.length})
          </button>

          <button
            onClick={handleOpenAddProduct}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Prato / Produto</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
        {/* Categories Tab */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setSelectedCategoryTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategoryTab === 'all'
                ? 'bg-zinc-900 text-white shadow-2xs'
                : 'bg-white text-zinc-600 hover:bg-zinc-200/80 border border-zinc-200'
            }`}
          >
            Todos ({products.length})
          </button>

          {categories.map(cat => {
            const count = products.filter(p => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryTab(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategoryTab === cat.id
                    ? 'bg-zinc-900 text-white shadow-2xs font-bold'
                    : 'bg-white text-zinc-600 hover:bg-zinc-200/80 border border-zinc-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Buscar por nome no cardápio..."
            className="w-full pl-9 pr-3 py-1.5 bg-white text-xs rounded-xl border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Products Table / Cards List */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Prato / Foto</th>
                <th className="p-3.5">Categoria</th>
                <th className="p-3.5">Preço</th>
                <th className="p-3.5">Adicionais</th>
                <th className="p-3.5 text-center">Status no Cardápio</th>
                <th className="p-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredProducts.map(product => {
                const category = categories.find(c => c.id === product.categoryId);

                return (
                  <tr key={product.id} className="hover:bg-zinc-50/70 transition-colors">
                    {/* Item & Photo */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-zinc-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-900 text-sm truncate">
                              {product.name}
                            </span>
                            {product.badge && (
                              <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                                {product.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 line-clamp-1 max-w-sm mt-0.5">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-3.5 text-zinc-600 font-medium">
                      {category?.name || 'Geral'}
                    </td>

                    {/* Price */}
                    <td className="p-3.5 font-bold text-zinc-900 text-sm">
                      {formatCurrency(product.price)}
                    </td>

                    {/* Complements count */}
                    <td className="p-3.5 text-zinc-500">
                      {product.complements?.length ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-semibold">
                          {product.complements.length} opções
                        </span>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>

                    {/* Availability toggle */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => toggleProductAvailability(product.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          product.isAvailable
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                            : 'bg-red-100 hover:bg-red-200 text-red-800'
                        }`}
                        title="Clique para alternar disponibilidade do prato"
                      >
                        {product.isAvailable ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Disponível</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-red-600" />
                            <span>Esgotado</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditProduct(product)}
                        className="p-1.5 text-zinc-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors inline-flex items-center"
                        title="Editar prato"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Tem certeza que deseja excluir "${product.name}" do cardápio?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center"
                        title="Excluir produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-zinc-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <h3 className="text-lg font-bold text-zinc-900">
                {editingProduct ? 'Editar Prato no Cardápio' : 'Adicionar Novo Prato / Bebida'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="py-4 space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Nome do Prato / Item *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="Ex: Picanha na Brasa com Alho"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Descrição Apetitosa / Ingredientes
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Descreva o sabor, cortes, acompanhamentos e origem..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Price, Prep Time, Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Preço (R$) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-bold">R$</span>
                    <input
                      type="text"
                      required
                      value={formPrice}
                      onChange={e => setFormPrice(e.target.value)}
                      placeholder="49,90"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-zinc-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Tempo Médio (min)
                  </label>
                  <input
                    type="number"
                    value={formPrepTime}
                    onChange={e => setFormPrepTime(e.target.value)}
                    placeholder="15"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Selo / Badge (opcional)
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={e => setFormBadge(e.target.value)}
                    placeholder="Ex: Mais Vendido, Chef..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Dietary check */}
              <div className="flex items-center gap-6 text-xs text-zinc-700 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formVegetarian}
                    onChange={e => setFormVegetarian(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>Opção Vegetariana</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formGlutenFree}
                    onChange={e => setFormGlutenFree(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>Sem Glúten</span>
                </label>
              </div>

              {/* Photo Selector */}
              <div className="space-y-2 pt-2 border-t border-zinc-200">
                <label className="block text-xs font-bold text-zinc-700">
                  Foto do Prato:
                </label>

                {/* Current preview */}
                <div className="flex items-center gap-3">
                  {formImage && (
                    <img
                      src={formImage}
                      alt="Prévia"
                      className="w-16 h-16 rounded-xl object-cover border border-zinc-200 shrink-0"
                    />
                  )}
                  <input
                    type="url"
                    value={formImage}
                    onChange={e => setFormImage(e.target.value)}
                    placeholder="Cole a URL da imagem..."
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <label className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleImageFileUpload} className="sr-only" />
                  </label>
                </div>

                {/* Quick gallery select */}
                <div>
                  <span className="text-[11px] text-zinc-400 block mb-1.5">Ou escolha uma foto de alta resolução pré-configurada:</span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {SAMPLE_FOOD_PHOTOS.map(sample => (
                      <button
                        key={sample.name}
                        type="button"
                        onClick={() => setFormImage(sample.url)}
                        className={`shrink-0 text-center rounded-xl p-1 border transition-all ${
                          formImage === sample.url ? 'border-amber-500 ring-2 ring-amber-200' : 'border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <img src={sample.url} alt={sample.name} className="w-12 h-12 rounded-lg object-cover" />
                        <span className="text-[9px] text-zinc-600 block truncate w-14 mt-1">{sample.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Complements / Adicionais Builder */}
              <div className="space-y-2 pt-2 border-t border-zinc-200">
                <label className="block text-xs font-bold text-zinc-700">
                  Adicionais & Opcionais do Prato (Ex: Ponto da carne, Queijo Extra, etc.):
                </label>

                {formComplements.length > 0 && (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto p-2 bg-zinc-50 rounded-xl border border-zinc-200">
                    {formComplements.map(c => (
                      <div key={c.id} className="flex justify-between items-center text-xs bg-white p-2 rounded-lg border border-zinc-200">
                        <span className="font-medium text-zinc-800">{c.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-700">
                            {c.price > 0 ? formatCurrency(c.price) : 'Grátis / Incluso'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveComplement(c.id)}
                            className="text-zinc-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCompName}
                    onChange={e => setNewCompName(e.target.value)}
                    placeholder="Nome do adicional (ex: Bacon extra)"
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-zinc-300"
                  />
                  <input
                    type="text"
                    value={newCompPrice}
                    onChange={e => setNewCompPrice(e.target.value)}
                    placeholder="Valor R$ (ex: 5.00)"
                    className="w-24 text-xs px-3 py-2 rounded-xl border border-zinc-300"
                  />
                  <button
                    type="button"
                    onClick={handleAddComplement}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl"
                  >
                    + Adicionar
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 text-xs font-bold hover:bg-zinc-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Criar Prato no Cardápio'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CATEGORIES MANAGER MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <h3 className="text-lg font-bold text-zinc-900">
                Gerenciar Categorias do Cardápio
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              {/* Add category input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  placeholder="Nova categoria (ex: Pizzas, Vinhos...)"
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
                <button
                  onClick={() => {
                    if (newCategoryName.trim()) {
                      addCategory(newCategoryName.trim());
                      setNewCategoryName('');
                    }
                  }}
                  disabled={!newCategoryName.trim()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-200 text-white text-xs font-bold rounded-xl"
                >
                  Adicionar
                </button>
              </div>

              {/* Categories list */}
              <div className="space-y-2 max-h-64 overflow-y-auto p-1">
                {categories.map(cat => {
                  const isEditing = editingCatId === cat.id;

                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 text-xs"
                    >
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingCatName}
                          onChange={e => setEditingCatName(e.target.value)}
                          className="flex-1 px-2 py-1 bg-white border border-zinc-300 rounded-lg mr-2 font-bold"
                        />
                      ) : (
                        <span className="font-bold text-zinc-800">{cat.name}</span>
                      )}

                      <div className="flex items-center gap-1">
                        {isEditing ? (
                          <button
                            onClick={() => {
                              if (editingCatName.trim()) {
                                updateCategory(cat.id, editingCatName.trim());
                                setEditingCatId(null);
                              }
                            }}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingCatId(cat.id);
                              setEditingCatName(cat.name);
                            }}
                            className="p-1 text-zinc-500 hover:text-amber-600 hover:bg-zinc-200 rounded-md"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (confirm(`Deseja excluir a categoria "${cat.name}"?`)) {
                              deleteCategory(cat.id);
                            }
                          }}
                          className="p-1 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200 text-right">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
