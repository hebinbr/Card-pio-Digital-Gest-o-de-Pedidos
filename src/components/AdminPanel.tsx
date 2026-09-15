import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { KitchenOrdersView } from './KitchenOrdersView';
import { MenuEditorView } from './MenuEditorView';
import { SalesReportsView } from './SalesReportsView';
import { QRCodeManager } from './QRCodeManager';
import { SettingsView } from './SettingsView';
import {
  Flame,
  Layers,
  TrendingUp,
  QrCode,
  Settings,
  ArrowLeft,
  ChefHat,
  Store
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    config,
    adminTab,
    setAdminTab,
    setCurrentView,
    pendingOrdersCount
  } = useRestaurant();

  const tabs = [
    {
      id: 'orders' as const,
      label: 'Cozinha & Pedidos (KDS)',
      icon: Flame,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null
    },
    {
      id: 'menu_editor' as const,
      label: 'Gerenciar Cardápio',
      icon: Layers,
      badge: null
    },
    {
      id: 'reports' as const,
      label: 'Relatórios de Vendas',
      icon: TrendingUp,
      badge: null
    },
    {
      id: 'qrcodes' as const,
      label: 'QR Code das Mesas',
      icon: QrCode,
      badge: null
    },
    {
      id: 'settings' as const,
      label: 'Configurações',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-100/60 pb-20">
      
      {/* Admin Top Banner */}
      <div className="bg-zinc-900 text-white border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-white tracking-tight">
                    Painel Administrativo do Restaurante
                  </h1>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                    Modo Gestão
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  {config.name} • {config.address}
                </p>
              </div>
            </div>

            {/* Switch back to Customer Menu button */}
            <button
              onClick={() => setCurrentView('menu')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 self-start sm:self-auto border border-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver Cardápio como Cliente</span>
            </button>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto pb-0.5 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = adminTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id)}
                  className={`px-4 py-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'border-amber-500 text-amber-400 bg-zinc-800/60'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Admin Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {adminTab === 'orders' && <KitchenOrdersView />}
        {adminTab === 'menu_editor' && <MenuEditorView />}
        {adminTab === 'reports' && <SalesReportsView />}
        {adminTab === 'qrcodes' && <QRCodeManager />}
        {adminTab === 'settings' && <SettingsView />}
      </main>

    </div>
  );
};
