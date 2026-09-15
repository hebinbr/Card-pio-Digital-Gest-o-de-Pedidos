import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Settings, Store, Wifi, Percent, RefreshCw, Check, AlertTriangle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { config, updateConfig, resetAllToDefault } = useRestaurant();

  const [name, setName] = useState(config.name);
  const [slogan, setSlogan] = useState(config.slogan);
  const [address, setAddress] = useState(config.address);
  const [phone, setPhone] = useState(config.phone);
  const [wifiName, setWifiName] = useState(config.wifiName);
  const [wifiPassword, setWifiPassword] = useState(config.wifiPassword);
  const [serviceFeePercentage, setServiceFeePercentage] = useState(String(config.serviceFeePercentage));
  const [totalTables, setTotalTables] = useState(String(config.totalTables));

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      name: name.trim(),
      slogan: slogan.trim(),
      address: address.trim(),
      phone: phone.trim(),
      wifiName: wifiName.trim(),
      wifiPassword: wifiPassword.trim(),
      serviceFeePercentage: parseFloat(serviceFeePercentage) || 0,
      totalTables: parseInt(totalTables, 10) || 16
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5 text-zinc-600" />
          <span>Configurações</span>
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 font-display">
          Dados do Restaurante & Operação
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
          Atualize as informações exibidas no cardápio dos clientes e nas placas de QR Code das mesas.
        </p>
      </div>

      {savedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          Configurações salvas com sucesso! O cardápio dos clientes já está atualizado.
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-2xs space-y-6">
        
        {/* Restaurant Identity */}
        <div>
          <h3 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
            <Store className="w-4 h-4 text-amber-600" />
            Identidade do Estabelecimento
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Nome do Restaurante / Bar:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Slogan / Descrição Curta:
              </label>
              <input
                type="text"
                value={slogan}
                onChange={e => setSlogan(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Endereço:
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Telefone / WhatsApp de Contato:
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Wi-Fi Credentials */}
        <div className="pt-4 border-t border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
            <Wifi className="w-4 h-4 text-blue-600" />
            Rede Wi-Fi para Clientes (Exibida no Cardápio e no QR Code da Mesa)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Nome da Rede (SSID):
              </label>
              <input
                type="text"
                value={wifiName}
                onChange={e => setWifiName(e.target.value)}
                placeholder="Ex: Terraco_Clientes"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Senha do Wi-Fi:
              </label>
              <input
                type="text"
                value={wifiPassword}
                onChange={e => setWifiPassword(e.target.value)}
                placeholder="Ex: senha123"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Salon and Service Rules */}
        <div className="pt-4 border-t border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
            <Percent className="w-4 h-4 text-emerald-600" />
            Salão & Parâmetros Financeiros
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Quantidade Total de Mesas no Salão:
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={totalTables}
                onChange={e => setTotalTables(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Define quantas mesas serão geradas no lote de QR Codes.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Taxa de Serviço Opcional (% do garçom):
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={serviceFeePercentage}
                onChange={e => setServiceFeePercentage(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Padrão é 10%. O cliente pode optar por retirar na finalização.
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-zinc-200 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Salvar Configurações
          </button>
        </div>

      </form>

      {/* Danger zone / Reset Demo Data */}
      <div className="bg-red-50/50 p-6 rounded-2xl border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-red-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Restaurar Dados Demonstrativos
          </h4>
          <p className="text-xs text-red-700/80 mt-0.5">
            Recarrega o cardápio padrão, produtos da parrilla e histórico de pedidos para testes.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Tem certeza que deseja restaurar o cardápio e os relatórios para o estado padrão?')) {
              resetAllToDefault();
            }
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restaurar Padrão</span>
        </button>
      </div>

    </div>
  );
};
