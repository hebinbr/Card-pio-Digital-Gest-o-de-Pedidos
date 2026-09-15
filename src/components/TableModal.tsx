import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { MapPin, X, Check, QrCode } from 'lucide-react';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableModal: React.FC<TableModalProps> = ({ isOpen, onClose }) => {
  const { activeTable, setActiveTable, config, setCurrentView, setAdminTab } = useRestaurant();
  const [customTable, setCustomTable] = useState('');

  if (!isOpen) return null;

  const handleSelectTable = (tbl: string) => {
    setActiveTable(tbl);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTable.trim()) {
      setActiveTable(customTable.trim());
      setCustomTable('');
      onClose();
    }
  };

  const tableList = Array.from({ length: config.totalTables || 16 }, (_, i) => String(i + 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-200">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Em qual mesa você está?</h2>
              <p className="text-xs text-zinc-500">Seus pedidos serão entregues diretamente nela</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4">
          <label className="block text-xs font-semibold text-zinc-600 mb-2">
            Mesas do Salão Principal:
          </label>
          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
            {tableList.map((tbl) => {
              const isSelected = activeTable === tbl;
              return (
                <button
                  key={tbl}
                  onClick={() => handleSelectTable(tbl)}
                  className={`py-3 px-2 rounded-xl text-center font-bold text-sm transition-all border ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-zinc-50 hover:bg-amber-50 text-zinc-700 border-zinc-200 hover:border-amber-300'
                  }`}
                >
                  Mesa {tbl}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleCustomSubmit} className="mt-4 pt-4 border-t border-zinc-100">
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
              Ou digite outro local / mesa especial:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTable}
                onChange={(e) => setCustomTable(e.target.value)}
                placeholder="Ex: Varanda 3, Balcão 1..."
                className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!customTable.trim()}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <span>Mesa ativa no momento: <strong>Mesa {activeTable}</strong></span>
          <button
            onClick={() => {
              onClose();
              setCurrentView('admin');
              setAdminTab('qrcodes');
            }}
            className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
          >
            <QrCode className="w-3.5 h-3.5" />
            Ver QR Code desta mesa
          </button>
        </div>
      </div>
    </div>
  );
};
