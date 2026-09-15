import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Utensils, ShoppingBag, LayoutDashboard, QrCode, ChefHat, MapPin, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onOpenTableModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTableModal }) => {
  const {
    config,
    currentView,
    setCurrentView,
    activeTable,
    cartItemCount,
    cartTotal,
    setIsCartOpen,
    pendingOrdersCount,
    setAdminTab
  } = useRestaurant();

  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cartTotal);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('menu')}
              className="flex items-center gap-3 text-left group focus:outline-hidden"
              title="Ir para o Cardápio"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs font-bold text-xl transition-transform group-hover:scale-105">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-zinc-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                  {config.name}
                </h1>
                <p className="text-xs text-zinc-500 hidden sm:block line-clamp-1">
                  {config.slogan}
                </p>
              </div>
            </button>
          </div>

          {/* Center: Table Badge (in Menu View) */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTableModal}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer"
              title="Alterar número da sua mesa"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Mesa {activeTable}</span>
              <ChevronDown className="w-3.5 h-3.5 text-amber-700" />
            </button>
          </div>

          {/* Right Navigation & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* View Switcher: Cardápio vs Painel do Dono */}
            <div className="inline-flex p-1 bg-zinc-100 rounded-xl border border-zinc-200">
              <button
                onClick={() => setCurrentView('menu')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === 'menu'
                    ? 'bg-white text-zinc-900 shadow-2xs font-bold'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Utensils className="w-4 h-4 text-amber-500" />
                <span className="hidden md:inline">Cardápio</span>
              </button>

              <button
                onClick={() => setCurrentView('admin')}
                className={`relative px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === 'admin'
                    ? 'bg-white text-zinc-900 shadow-2xs font-bold'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-zinc-700" />
                <span className="hidden md:inline">Painel Dono</span>
                {pendingOrdersCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold animate-pulse">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Quick QR Code action if in admin or wanting to see table QR */}
            <button
              onClick={() => {
                setCurrentView('admin');
                setAdminTab('qrcodes');
              }}
              className="p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors hidden sm:flex items-center justify-center border border-zinc-200"
              title="Gerar e Imprimir QR Codes das Mesas"
            >
              <QrCode className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold text-sm transition-all shadow-xs cursor-pointer"
              aria-label="Abrir carrinho de pedidos"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Carrinho</span>
              {cartItemCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-white text-amber-700 rounded-full shadow-2xs">
                  {cartItemCount}
                </span>
              )}
              {cartItemCount > 0 && (
                <span className="hidden lg:inline text-amber-100 font-normal text-xs ml-0.5 border-l border-amber-400/40 pl-2">
                  {formattedTotal}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
