import React, { useState } from 'react';
import { Product, Complement } from '../types';
import { useRestaurant } from '../context/RestaurantContext';
import { X, Plus, Minus, Clock, Check, Sparkles, AlertCircle } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart, setIsCartOpen } = useRestaurant();
  const [quantity, setQuantity] = useState(1);
  const [selectedComplements, setSelectedComplements] = useState<Complement[]>([]);
  const [notes, setNotes] = useState('');

  if (!product) return null;

  const handleToggleComplement = (complement: Complement) => {
    setSelectedComplements(prev => {
      const exists = prev.some(c => c.id === complement.id);
      if (exists) {
        return prev.filter(c => c.id !== complement.id);
      } else {
        return [...prev, complement];
      }
    });
  };

  const complementsTotal = selectedComplements.reduce((sum, c) => sum + c.price, 0);
  const singleItemPrice = product.price + complementsTotal;
  const totalPrice = singleItemPrice * quantity;

  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(totalPrice);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedComplements, notes);
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-zinc-200 my-8">
        
        {/* Header Image */}
        <div className="relative h-64 sm:h-72 w-full bg-zinc-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {product.badge && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {product.badge}
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-xl sm:text-2xl font-bold leading-tight drop-shadow-sm">
              {product.name}
            </h2>
            <div className="flex items-center gap-3 mt-1 text-xs text-zinc-200">
              {product.preparationTimeMinutes && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  ~{product.preparationTimeMinutes} min
                </span>
              )}
              {product.tags?.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-xs uppercase text-[10px] font-semibold">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-320px)] overflow-y-auto space-y-6">
          
          {/* Description */}
          <div>
            <p className="text-zinc-600 text-sm leading-relaxed">
              {product.description}
            </p>
            <div className="mt-2 text-xl font-bold text-amber-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </div>
          </div>

          {/* Availability Alert if unavailable */}
          {!product.isAvailable && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4" />
              Este item está temporariamente esgotado no momento.
            </div>
          )}

          {/* Complements / Customizations */}
          {product.complements && product.complements.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-zinc-900 mb-2 flex items-center justify-between">
                <span>Personalize seu prato / Adicionais:</span>
                <span className="text-xs text-zinc-400 font-normal">Opcional</span>
              </h3>
              <div className="space-y-2">
                {product.complements.map(comp => {
                  const isChecked = selectedComplements.some(c => c.id === comp.id);
                  return (
                    <label
                      key={comp.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'border-amber-500 bg-amber-50/50'
                          : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            isChecked
                              ? 'bg-amber-500 border-amber-500 text-white'
                              : 'border-zinc-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-sm font-medium text-zinc-800">
                          {comp.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-zinc-600">
                        {comp.price > 0
                          ? `+ ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(comp.price)}`
                          : 'Incluso'}
                      </span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleComplement(comp)}
                        className="sr-only"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Kitchen Notes */}
          <div>
            <label className="block text-sm font-bold text-zinc-900 mb-1.5">
              Observações para a cozinha:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Ponto da carne bem passado, sem cebola, molho à parte..."
              className="w-full text-sm p-3 rounded-xl border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder:text-zinc-400"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between gap-4">
          
          {/* Quantity stepper */}
          <div className="flex items-center bg-white border border-zinc-300 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1 || !product.isAvailable}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-zinc-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              disabled={!product.isAvailable}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to order button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.isAvailable}
            className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all shadow-xs flex items-center justify-between cursor-pointer"
          >
            <span>{product.isAvailable ? 'Adicionar ao Pedido' : 'Esgotado'}</span>
            <span>{formattedTotal}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
