import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  Award,
  Download,
  Calendar,
  Filter,
  CreditCard,
  QrCode,
  PieChart,
  BarChart3,
  RefreshCw,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';

export const SalesReportsView: React.FC = () => {
  const { salesReport, orders, createOrder, products, resetAllToDefault } = useRestaurant();
  const [historySearch, setHistorySearch] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today'>('all');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Export orders to CSV
  const handleExportCSV = () => {
    const headers = ['Numero_Pedido', 'Mesa', 'Data_Hora', 'Cliente', 'Status', 'Metodo_Pagamento', 'Subtotal', 'Taxa_Servico', 'Total_R$'];
    const rows = orders.map(o => [
      o.orderNumber,
      `Mesa ${o.tableNumber}`,
      new Date(o.createdAt).toLocaleString('pt-BR'),
      o.customerName || 'Cliente',
      o.status,
      o.paymentMethod,
      o.subtotal.toFixed(2),
      o.serviceFee.toFixed(2),
      o.total.toFixed(2)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_vendas_restaurante_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulate a random incoming order to showcase real-time analytics
  const handleSimulateOrder = () => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomTable = String(Math.floor(1 + Math.random() * 12));
    const randomNames = ['Ana Clara', 'Bruno Ramos', 'Carla Nogueira', 'Diego Martins', 'Eduardo Santos', 'Fernanda Lima'];
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const methods = ['pix', 'cartao_credito', 'cartao_debito', 'pagar_na_mesa'] as const;
    const randomMethod = methods[Math.floor(Math.random() * methods.length)];

    createOrder({
      customerName: randomName,
      paymentMethod: randomMethod,
      notes: 'Pedido simulado para demonstração de relatórios'
    });
  };

  const filteredHistory = orders.filter(o => {
    if (dateFilter === 'today') {
      const isToday = new Date(o.createdAt).toDateString() === new Date().toDateString();
      if (!isToday) return false;
    }
    if (historySearch.trim()) {
      const q = historySearch.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customerName?.toLowerCase().includes(q);
      const matchTable = `mesa ${o.tableNumber}`.includes(q);
      return matchNum || matchName || matchTable;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Inteligência & Gestão</span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 font-display">
            Relatórios de Vendas em Tempo Real
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Acompanhe a performance financeira do restaurante, faturamento por categoria, itens mais vendidos e fluxo de pedidos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateOrder}
            className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Simular pedido novo para ver os gráficos se atualizando ao vivo"
          >
            <PlusCircle className="w-4 h-4 text-amber-600" />
            <span>Simular Pedido</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Faturamento Total</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-zinc-900 font-display">
              {formatCurrency(salesReport.totalRevenue)}
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <span>Hoje: <strong>{formatCurrency(salesReport.todayRevenue)}</strong></span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Pedidos Concluídos</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-zinc-900 font-display">
              {salesReport.totalOrders}
            </div>
            <div className="text-xs text-zinc-500 font-semibold mt-1">
              {salesReport.todayOrders} pedidos recebidos hoje
            </div>
          </div>
        </div>

        {/* KPI 3: Average Ticket */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ticket Médio</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-zinc-900 font-display">
              {formatCurrency(salesReport.averageTicket)}
            </div>
            <div className="text-xs text-blue-700 font-semibold mt-1">
              Gasto médio por mesa / comanda
            </div>
          </div>
        </div>

        {/* KPI 4: Pending / Cooking */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Fila da Cozinha</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-zinc-900 font-display">
              {salesReport.statusBreakdown.recebido + salesReport.statusBreakdown.preparando}
            </div>
            <div className="text-xs text-purple-700 font-semibold mt-1">
              Pedidos em preparo no salão
            </div>
          </div>
        </div>

      </div>

      {/* Visual Analytics Sections (Category Sales & Hourly Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sales by Category (Bar breakdown) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-zinc-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-sm text-zinc-900">Vendas por Categoria</h3>
            </div>
            <span className="text-xs text-zinc-400">Participação na receita</span>
          </div>

          <div className="space-y-3 pt-1">
            {salesReport.categorySales.map(cat => (
              <div key={cat.categoryId} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-800">{cat.categoryName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500">{cat.count} itens</span>
                    <span className="font-extrabold text-zinc-900">{formatCurrency(cat.total)}</span>
                    <span className="w-12 text-right font-bold text-amber-600">{cat.percentage}%</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(cat.percentage, 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly distribution / Peak times */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-zinc-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-sm text-zinc-900">Turnos & Horários de Pico</h3>
            </div>
            <span className="text-xs text-zinc-400">Fluxo de clientes</span>
          </div>

          <div className="space-y-3 pt-1">
            {salesReport.hourlySales.map(bucket => {
              const maxBucketRevenue = Math.max(...salesReport.hourlySales.map(b => b.totalRevenue), 1);
              const barPercent = Math.round((bucket.totalRevenue / maxBucketRevenue) * 100);

              return (
                <div key={bucket.hourLabel} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-zinc-700">{bucket.hourLabel}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 text-[11px]">{bucket.ordersCount} pedidos</span>
                      <span className="font-bold text-zinc-900">{formatCurrency(bucket.totalRevenue)}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(barPercent, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment Methods breakdown */}
          <div className="pt-4 border-t border-zinc-100">
            <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2.5">
              Meios de Pagamento Utilizados
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {salesReport.paymentBreakdown.map(p => (
                <div key={p.method} className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[11px] text-zinc-500 block truncate">{p.method}</span>
                  <span className="font-bold text-zinc-900 text-sm block mt-0.5">{formatCurrency(p.total)}</span>
                  <span className="text-[10px] text-zinc-400">{p.count} transações</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Top 5 Best Selling Items */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-zinc-900">Top 5 Pratos Mais Pedidos & Rentáveis</h3>
          </div>
          <span className="text-xs text-zinc-400">Classificação por volume de vendas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {salesReport.topSellingProducts.map((item, index) => (
            <div
              key={item.product.id}
              className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2.5">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-md bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    #{index + 1}
                  </div>
                </div>

                <h4 className="font-bold text-zinc-900 text-xs line-clamp-1">
                  {item.product.name}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-200/80 flex justify-between items-baseline text-xs">
                <span className="text-zinc-500 font-semibold">{item.totalQty} vendidos</span>
                <span className="font-extrabold text-amber-700">{formatCurrency(item.totalSales)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders History Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden space-y-3 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-100">
          <div>
            <h3 className="font-bold text-sm text-zinc-900">Histórico de Pedidos & Faturamento</h3>
            <p className="text-xs text-zinc-500">Listagem de todas as comandas registradas no sistema</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDateFilter(dateFilter === 'all' ? 'today' : 'all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                dateFilter === 'today'
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-700 border-zinc-200'
              }`}
            >
              {dateFilter === 'today' ? 'Exibindo: Somente Hoje' : 'Exibir: Todos os Dias'}
            </button>

            <input
              type="text"
              value={historySearch}
              onChange={e => setHistorySearch(e.target.value)}
              placeholder="Buscar pedido, mesa..."
              className="px-3 py-1.5 text-xs rounded-xl border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 w-40 sm:w-56"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3">Comanda</th>
                <th className="p-3">Mesa</th>
                <th className="p-3">Horário</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Itens</th>
                <th className="p-3">Status</th>
                <th className="p-3">Pagamento</th>
                <th className="p-3 text-right">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredHistory.map(o => (
                <tr key={o.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="p-3 font-mono font-bold text-zinc-900">{o.orderNumber}</td>
                  <td className="p-3 font-black text-amber-700">Mesa {o.tableNumber}</td>
                  <td className="p-3 text-zinc-500">
                    {new Date(o.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-3 text-zinc-700 font-medium">{o.customerName || 'Cliente'}</td>
                  <td className="p-3 text-zinc-600 max-w-xs truncate">
                    {o.items.map(it => `${it.quantity}x ${it.product.name}`).join(', ')}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      o.status === 'entregue'
                        ? 'bg-emerald-100 text-emerald-800'
                        : o.status === 'cancelado'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-500 uppercase text-[11px]">
                    {o.paymentMethod.replace('_', ' ')}
                  </td>
                  <td className="p-3 text-right font-bold text-zinc-900">
                    {formatCurrency(o.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
