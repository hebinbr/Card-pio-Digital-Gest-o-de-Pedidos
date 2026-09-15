import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Order, OrderStatus } from '../types';
import {
  Clock,
  MapPin,
  CheckCircle2,
  ChefHat,
  BellRing,
  Sparkles,
  XCircle,
  Filter,
  User,
  Phone,
  AlertTriangle,
  Flame,
  ArrowRight
} from 'lucide-react';

export const KitchenOrdersView: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder } = useRestaurant();
  const [filterStatus, setFilterStatus] = useState<string>('ativos');
  const [filterTable, setFilterTable] = useState<string>('all');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const getElapsedTime = (isoDate: string) => {
    const diffMin = Math.round((Date.now() - new Date(isoDate).getTime()) / (1000 * 60));
    if (diffMin <= 0) return 'Agora';
    if (diffMin < 60) return `há ${diffMin} min`;
    const hours = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    return `há ${hours}h ${mins}m`;
  };

  const filteredOrders = orders.filter(order => {
    if (filterTable !== 'all' && order.tableNumber !== filterTable) return false;

    if (filterStatus === 'ativos') {
      return order.status === 'recebido' || order.status === 'preparando' || order.status === 'pronto';
    }
    if (filterStatus === 'recebido') return order.status === 'recebido';
    if (filterStatus === 'preparando') return order.status === 'preparando';
    if (filterStatus === 'pronto') return order.status === 'pronto';
    if (filterStatus === 'entregue') return order.status === 'entregue';
    if (filterStatus === 'cancelado') return order.status === 'cancelado';
    return true;
  });

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    if (current === 'recebido') return 'preparando';
    if (current === 'preparando') return 'pronto';
    if (current === 'pronto') return 'entregue';
    return null;
  };

  const getNextButtonLabel = (current: OrderStatus) => {
    if (current === 'recebido') return 'Iniciar Preparo na Cozinha';
    if (current === 'preparando') return 'Marcar como Pronto p/ Servir';
    if (current === 'pronto') return 'Confirmar Entrega na Mesa';
    return '';
  };

  const statusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'recebido':
        return (
          <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Novo Pedido
          </span>
        );
      case 'preparando':
        return (
          <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center gap-1">
            <ChefHat className="w-3.5 h-3.5 text-blue-600" />
            Na Cozinha
          </span>
        );
      case 'pronto':
        return (
          <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 font-bold text-xs flex items-center gap-1">
            <BellRing className="w-3.5 h-3.5 text-purple-600 animate-bounce" />
            Pronto p/ Levar
          </span>
        );
      case 'entregue':
        return (
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Entregue
          </span>
        );
      case 'cancelado':
        return (
          <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-800 font-bold text-xs flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Cancelado
          </span>
        );
    }
  };

  const activeCount = orders.filter(o => o.status === 'recebido' || o.status === 'preparando' || o.status === 'pronto').length;
  const receivedCount = orders.filter(o => o.status === 'recebido').length;
  const preparingCount = orders.filter(o => o.status === 'preparando').length;
  const readyCount = orders.filter(o => o.status === 'pronto').length;

  return (
    <div className="space-y-6">
      
      {/* Header & Quick stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold mb-2">
            <Flame className="w-3.5 h-3.5 text-orange-600" />
            <span>KDS • Cozinha & Garçons</span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 font-display">
            Monitor de Pedidos em Tempo Real
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Gerencie o fluxo dos pedidos enviados das mesas direto para a cozinha e salão.
          </p>
        </div>

        {/* Quick KPI pills */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-[10px] uppercase font-bold text-amber-700 block">Novos</span>
            <span className="text-lg font-black text-amber-900">{receivedCount}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-center">
            <span className="text-[10px] uppercase font-bold text-blue-700 block">Preparo</span>
            <span className="text-lg font-black text-blue-900">{preparingCount}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 text-center">
            <span className="text-[10px] uppercase font-bold text-purple-700 block">Prontos</span>
            <span className="text-lg font-black text-purple-900">{readyCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
        
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'ativos', label: `Pedidos Ativos (${activeCount})` },
            { id: 'recebido', label: `Novos (${receivedCount})` },
            { id: 'preparando', label: `Na Cozinha (${preparingCount})` },
            { id: 'pronto', label: `Prontos (${readyCount})` },
            { id: 'entregue', label: 'Concluídos' },
            { id: 'all', label: 'Todos os Pedidos' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterStatus === f.id
                  ? 'bg-zinc-900 text-white shadow-2xs'
                  : 'bg-white text-zinc-600 hover:bg-zinc-200/80 border border-zinc-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500 font-medium">Filtrar por mesa:</span>
          <select
            value={filterTable}
            onChange={e => setFilterTable(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Todas as Mesas</option>
            {Array.from(new Set(orders.map(o => o.tableNumber))).sort((a, b) => Number(a) - Number(b)).map(tbl => (
              <option key={tbl} value={tbl}>Mesa {tbl}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 shadow-2xs max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-zinc-800">Nenhum pedido nesta visualização</h3>
          <p className="text-xs text-zinc-500 mt-1">
            {filterStatus === 'ativos'
              ? 'Todos os pedidos foram preparados e entregues nas mesas!'
              : 'Selecione outro filtro para visualizar pedidos históricos.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(order => {
            const nextStatus = getNextStatus(order.status);
            const nextLabel = getNextButtonLabel(order.status);

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between shadow-2xs ${
                  order.status === 'recebido'
                    ? 'border-amber-300 ring-2 ring-amber-100 shadow-md'
                    : order.status === 'preparando'
                    ? 'border-blue-200'
                    : order.status === 'pronto'
                    ? 'border-purple-300 ring-2 ring-purple-100'
                    : 'border-zinc-200 opacity-80'
                }`}
              >
                {/* Card Top */}
                <div className="p-4 border-b border-zinc-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-zinc-900 text-sm">
                        {order.orderNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-zinc-900 text-white text-xs font-black flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        Mesa {order.tableNumber}
                      </span>
                    </div>

                    <div>{statusBadge(order.status)}</div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500 mt-2.5">
                    <span className="flex items-center gap-1 font-medium">
                      <User className="w-3 h-3 text-zinc-400" />
                      {order.customerName || 'Cliente'}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-zinc-600">
                      <Clock className="w-3 h-3 text-amber-600" />
                      {getElapsedTime(order.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-56">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-zinc-900">
                          <span className="text-amber-600 font-extrabold text-sm mr-1.5">
                            {item.quantity}x
                          </span>
                          {item.product.name}
                        </span>
                      </div>

                      {/* Complements */}
                      {item.selectedComplements.length > 0 && (
                        <div className="text-[11px] text-zinc-500 pl-5 mt-0.5 space-y-0.5">
                          {item.selectedComplements.map(c => (
                            <div key={c.id}>• {c.name}</div>
                          ))}
                        </div>
                      )}

                      {/* Notes */}
                      {item.notes && (
                        <div className="ml-5 mt-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[11px] font-semibold">
                          ⚠️ Obs: "{item.notes}"
                        </div>
                      )}
                    </div>
                  ))}

                  {/* General order notes */}
                  {order.notes && (
                    <div className="p-2 rounded-xl bg-zinc-100 text-zinc-700 text-xs">
                      <strong>Recado geral:</strong> {order.notes}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-zinc-50/80 border-t border-zinc-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">
                      Pagamento: <strong className="text-zinc-800 uppercase">{order.paymentMethod.replace('_', ' ')}</strong>
                    </span>
                    <span className="font-black text-sm text-zinc-900">
                      {formatCurrency(order.total)}
                    </span>
                  </div>

                  {/* Advance button if actionable */}
                  {nextStatus && (
                    <button
                      onClick={() => updateOrderStatus(order.id, nextStatus)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                        order.status === 'recebido'
                          ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700'
                          : order.status === 'preparando'
                          ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                          : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                      }`}
                    >
                      <span>{nextLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Secondary actions */}
                  <div className="flex justify-between items-center pt-1 text-[11px]">
                    {order.status !== 'cancelado' && order.status !== 'entregue' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelado')}
                        className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                      >
                        Cancelar pedido
                      </button>
                    )}

                    {order.status === 'entregue' && (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Finalizado com sucesso
                      </span>
                    )}

                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="text-zinc-400 hover:text-zinc-600 ml-auto cursor-pointer"
                    >
                      Remover do histórico
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
