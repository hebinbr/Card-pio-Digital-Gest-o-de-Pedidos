import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, QrCode, Banknote, Utensils, MessageSquare, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order } from '../types';

interface CartDrawerProps {
  onOpenTableModal: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenTableModal }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    cartSubtotal,
    cartServiceFee,
    cartTotal,
    activeTable,
    createOrder,
    config
  } = useRestaurant();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('pix');
  const [includeServiceFee, setIncludeServiceFee] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const currentServiceFee = includeServiceFee ? cartServiceFee : 0;
  const currentTotal = cartSubtotal + currentServiceFee;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    setTimeout(() => {
      createOrder({
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        paymentMethod,
        notes: orderNotes.trim() || undefined
      });

      setIsSubmitting(false);
      setIsCartOpen(false);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore if not supported
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-200 bg-zinc-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900">Seu Pedido</h2>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <span>Entregar na:</span>
                  <button
                    onClick={onOpenTableModal}
                    className="font-bold text-amber-700 hover:underline inline-flex items-center"
                  >
                    Mesa {activeTable}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  title="Limpar carrinho"
                  className="p-2 text-zinc-400 hover:text-red-600 hover:bg-zinc-100 rounded-lg transition-colors text-xs font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items or Empty State */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-3">
                  <Utensils className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="text-base font-bold text-zinc-800">Seu carrinho está vazio</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                  Navegue pelo nosso cardápio e selecione pratos deliciosos para a Mesa {activeTable}!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Explorar Cardápio
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map((item) => {
                    const complementsCost = item.selectedComplements.reduce((s, c) => s + c.price, 0);
                    const itemUnitTotal = item.product.price + complementsCost;
                    const itemLineTotal = itemUnitTotal * item.quantity;

                    return (
                      <div
                        key={item.cartItemId}
                        className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 flex gap-3 items-start"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-zinc-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-bold text-zinc-900 truncate">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.cartItemId)}
                              className="text-zinc-400 hover:text-red-500 p-0.5 ml-2"
                              title="Remover item"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Complements list */}
                          {item.selectedComplements.length > 0 && (
                            <div className="mt-1 space-y-0.5">
                              {item.selectedComplements.map(c => (
                                <div key={c.id} className="text-[11px] text-zinc-500 flex items-center justify-between">
                                  <span>+ {c.name}</span>
                                  {c.price > 0 && <span>{formatCurrency(c.price)}</span>}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Notes */}
                          {item.notes && (
                            <p className="text-[11px] text-amber-700 bg-amber-50 rounded-md px-2 py-1 mt-1.5 italic">
                              "{item.notes}"
                            </p>
                          )}

                          {/* Quantity & Price Row */}
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-200/70">
                            <div className="flex items-center border border-zinc-300 rounded-lg bg-white shadow-2xs">
                              <button
                                onClick={() => updateCartItemQuantity(item.cartItemId, -1)}
                                className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 rounded-l-lg transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold text-zinc-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartItemQuantity(item.cartItemId, 1)}
                                className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 rounded-r-lg transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="text-sm font-bold text-zinc-900">
                              {formatCurrency(itemLineTotal)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Customer Details Form */}
                <div className="pt-2 border-t border-zinc-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Dados para entrega na mesa
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Seu Nome ou Apelido:
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="Ex: João, Família Lima..."
                      className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      WhatsApp (opcional para notificações de status):
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="(11) 98888-7777"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Forma de Pagamento:
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'pix', label: 'PIX (QR Code)', icon: QrCode },
                        { id: 'cartao_credito', label: 'Cartão Crédito', icon: CreditCard },
                        { id: 'cartao_debito', label: 'Cartão Débito', icon: CreditCard },
                        { id: 'pagar_na_mesa', label: 'Pagar na Mesa', icon: Banknote },
                      ].map(method => {
                        const Icon = method.icon;
                        const isSelected = paymentMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentMethod(method.id as Order['paymentMethod'])}
                            className={`p-2.5 rounded-xl border flex items-center gap-2 text-left font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold'
                                : 'border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-white'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-600' : 'text-zinc-400'}`} />
                            <span className="truncate">{method.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Recado geral para o garçom / cozinha:
                    </label>
                    <input
                      type="text"
                      value={orderNotes}
                      onChange={e => setOrderNotes(e.target.value)}
                      placeholder="Ex: Trazer pratos e talheres para todos..."
                      className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer with Calculations and Confirm Button */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-zinc-200 bg-zinc-50 space-y-3">
              
              {/* Financial Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal dos itens</span>
                  <span className="font-semibold text-zinc-900">{formatCurrency(cartSubtotal)}</span>
                </div>

                {config.serviceFeePercentage > 0 && (
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-1.5 cursor-pointer text-zinc-600 hover:text-zinc-900">
                      <input
                        type="checkbox"
                        checked={includeServiceFee}
                        onChange={e => setIncludeServiceFee(e.target.checked)}
                        className="rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span>Taxa de serviço ({config.serviceFeePercentage}%)</span>
                    </label>
                    <span className="font-semibold text-zinc-900">
                      {includeServiceFee ? formatCurrency(cartServiceFee) : 'R$ 0,00'}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm sm:text-base font-bold text-zinc-900 pt-2 border-t border-zinc-200">
                  <span>Total do Pedido</span>
                  <span className="text-amber-600 font-extrabold">{formatCurrency(currentTotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:bg-zinc-300 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando para a cozinha...
                  </span>
                ) : (
                  <>
                    <span>Confirmar Pedido na Mesa {activeTable}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-zinc-400">
                Seu pedido é enviado em tempo real para a cozinha e garçons.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
