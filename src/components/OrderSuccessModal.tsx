import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { CheckCircle2, Clock, MapPin, ChefHat, BellRing, Sparkles, X } from 'lucide-react';
import { OrderStatus } from '../types';

export const OrderSuccessModal: React.FC = () => {
  const { activeOrder, setActiveOrder, orders } = useRestaurant();

  if (!activeOrder) return null;

  // Track the most current version of this order from orders array if status was updated by the kitchen!
  const currentLiveOrder = orders.find(o => o.id === activeOrder.id) || activeOrder;

  const steps: { key: OrderStatus; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'recebido', label: 'Pedido Recebido', desc: 'Anotado na cozinha', icon: CheckCircle2 },
    { key: 'preparando', label: 'Em Preparo', desc: 'O chef está cozinhando', icon: ChefHat },
    { key: 'pronto', label: 'Pronto p/ Servir', desc: 'Garçom a caminho da mesa', icon: BellRing },
    { key: 'entregue', label: 'Entregue', desc: 'Bom apetite!', icon: Sparkles },
  ];

  const statusHierarchy: Record<OrderStatus, number> = {
    recebido: 0,
    preparando: 1,
    pronto: 2,
    entregue: 3,
    cancelado: -1
  };

  const currentStepIndex = statusHierarchy[currentLiveOrder.status] ?? 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-zinc-200 animate-scaleUp">
        
        {/* Top Banner */}
        <div className="bg-emerald-600 p-6 text-white text-center relative">
          <button
            onClick={() => setActiveOrder(null)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-emerald-700/60 hover:bg-emerald-700 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-white text-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">
            Pedido Enviado com Sucesso!
          </h2>
          <p className="text-emerald-100 text-xs mt-1">
            A cozinha já começou a produzir seus itens
          </p>

          <div className="inline-flex items-center gap-3 bg-emerald-700/60 px-4 py-1.5 rounded-full mt-3 text-xs font-semibold">
            <span className="font-mono font-bold tracking-wider">{currentLiveOrder.orderNumber}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              Mesa {currentLiveOrder.tableNumber}
            </span>
          </div>
        </div>

        {/* Live Status Progress */}
        <div className="p-6 space-y-6">
          
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
              Status do seu pedido em tempo real:
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = idx <= currentStepIndex && currentLiveOrder.status !== 'cancelado';
                const isCurrent = idx === currentStepIndex && currentLiveOrder.status !== 'cancelado';

                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-amber-500 text-white ring-4 ring-amber-100 scale-105 shadow-xs'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-zinc-100 text-zinc-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-bold mt-2 leading-tight ${isCurrent ? 'text-amber-600' : isPassed ? 'text-emerald-700' : 'text-zinc-400'}`}>
                      {step.label}
                    </span>
                    <span className="text-[10px] text-zinc-400 hidden sm:block mt-0.5">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>

            {currentLiveOrder.status === 'cancelado' && (
              <div className="mt-3 p-3 bg-red-50 text-red-700 text-xs rounded-xl font-semibold text-center">
                Este pedido foi cancelado pela equipe do restaurante.
              </div>
            )}
          </div>

          {/* Items Summary */}
          <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200">
            <div className="flex justify-between items-center text-xs font-bold text-zinc-700 pb-2 border-b border-zinc-200/80 mb-2.5">
              <span>Itens Solicitados</span>
              <span className="text-zinc-400 font-normal">Previsão ~20 min</span>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {currentLiveOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between items-start text-xs text-zinc-700">
                  <div className="flex-1 pr-2">
                    <span className="font-bold text-zinc-900">{item.quantity}x </span>
                    <span>{item.product.name}</span>
                    {item.selectedComplements.length > 0 && (
                      <span className="text-[10px] text-zinc-500 block">
                        + {item.selectedComplements.map(c => c.name).join(', ')}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-zinc-900">
                    {formatCurrency((item.product.price + item.selectedComplements.reduce((s, c) => s + c.price, 0)) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2.5 mt-2 border-t border-zinc-200 text-sm font-bold text-zinc-900">
              <span>Total a pagar</span>
              <span className="text-emerald-700 font-extrabold">{formatCurrency(currentLiveOrder.total)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => setActiveOrder(null)}
              className="flex-1 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors text-center cursor-pointer"
            >
              Continuar no Cardápio
            </button>
            <button
              onClick={() => {
                setActiveOrder(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="py-3 px-4 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-semibold rounded-xl text-xs sm:text-sm transition-colors text-center cursor-pointer"
            >
              Fazer Outro Pedido
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
