import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import QRCode from 'qrcode';
import { QrCode, Printer, Copy, ExternalLink, Download, Check, Sparkles, Wifi, Utensils, RefreshCw } from 'lucide-react';

export const QRCodeManager: React.FC = () => {
  const { config, setActiveTable, setCurrentView } = useRestaurant();
  const [selectedTable, setSelectedTable] = useState<string>('1');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [batchQrs, setBatchQrs] = useState<{ table: string; dataUrl: string }[]>([]);

  // Base URL for the table
  const getTableUrl = (table: string) => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}?mesa=${table}`;
  };

  const currentUrl = getTableUrl(selectedTable);

  // Generate single QR code
  useEffect(() => {
    QRCode.toDataURL(
      currentUrl,
      {
        width: 320,
        margin: 1.5,
        color: {
          dark: '#18181b',
          light: '#ffffff'
        }
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [currentUrl, selectedTable]);

  // Generate batch QR codes for all tables if batchMode is enabled
  useEffect(() => {
    if (batchMode) {
      const promises = Array.from({ length: config.totalTables || 16 }, (_, i) => {
        const tbl = String(i + 1);
        const url = getTableUrl(tbl);
        return new Promise<{ table: string; dataUrl: string }>((resolve) => {
          QRCode.toDataURL(url, { width: 220, margin: 1 }, (err, dataUrl) => {
            resolve({ table: tbl, dataUrl: dataUrl || '' });
          });
        });
      });

      Promise.all(promises).then(results => {
        setBatchQrs(results);
      });
    }
  }, [batchMode, config.totalTables]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qrcode-mesa-${selectedTable}-${config.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTestInApp = () => {
    setActiveTable(selectedTable);
    setCurrentView('menu');
  };

  const tablesList = Array.from({ length: config.totalTables || 16 }, (_, i) => String(i + 1));

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
            <QrCode className="w-3.5 h-3.5 text-amber-600" />
            <span>Cardápio nas Mesas</span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 font-display">
            Gerador & Impressão de QR Code para Mesas
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl">
            Cada mesa possui um QR Code inteligente. Quando o cliente escaneia com o celular, o cardápio abre automaticamente configurado com o número daquela mesa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBatchMode(!batchMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              batchMode
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            {batchMode ? 'Ver Mesa Individual' : 'Ver Todas as Mesas (Grade)'}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Placas</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Single Table Detailed Card & Controls */}
      {!batchMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Controls */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Table Selector */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs space-y-3">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Selecione a Mesa para Gerar:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {tablesList.map(tbl => (
                  <button
                    key={tbl}
                    onClick={() => setSelectedTable(tbl)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                      selectedTable === tbl
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs scale-105'
                        : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    Mesa {tbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Link Info & Copy */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs space-y-3">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Link direto desta mesa:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 px-3 py-2 text-xs bg-zinc-50 rounded-xl border border-zinc-200 text-zinc-600 select-all font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                  title="Copiar link"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2 text-xs font-semibold">
                <button
                  onClick={handleDownloadQr}
                  className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar PNG</span>
                </button>

                <button
                  onClick={handleTestInApp}
                  className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                  <span>Testar como Cliente</span>
                </button>
              </div>
            </div>

            {/* Helpful instructions */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Como usar no seu restaurante:
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-800/90 pl-1">
                <li>Imprima a placa de mesa em papel couché ou coloque em um display de acrílico.</li>
                <li>O cliente chega, aponta a câmera e o cardápio já carrega a mesa dele.</li>
                <li>Os pedidos chegam instantaneamente com o número da mesa no painel da cozinha.</li>
              </ul>
            </div>

          </div>

          {/* Right: Realistic Table Acrylic Tent Card Preview */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
              Pré-visualização da Placa de Mesa (Pronta para Display de Acrílico)
            </span>

            {/* Printable Tent Card */}
            <div
              id="printable-table-card"
              className="w-full max-w-sm bg-white rounded-3xl p-8 border-2 border-zinc-300 shadow-xl text-center flex flex-col items-center relative overflow-hidden"
            >
              {/* Restaurant Header */}
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-3 shadow-xs">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black tracking-tight text-zinc-900 uppercase font-display">
                {config.name}
              </h3>
              <p className="text-[11px] text-zinc-400 font-medium">
                Cardápio Digital & Pedidos
              </p>

              {/* Table Number Highlight */}
              <div className="my-5 py-2 px-6 bg-zinc-900 text-white rounded-2xl shadow-xs">
                <span className="text-xs font-bold tracking-widest uppercase text-amber-400 block">
                  BEM-VINDO À
                </span>
                <span className="text-3xl font-black tracking-tight font-display">
                  MESA {selectedTable}
                </span>
              </div>

              {/* QR Code Container */}
              <div className="p-3.5 bg-white rounded-2xl border border-zinc-200 shadow-xs mb-4">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code Mesa ${selectedTable}`}
                    className="w-48 h-48 rounded-lg"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-zinc-50 rounded-lg">
                    <RefreshCw className="w-6 h-6 animate-spin text-zinc-400" />
                  </div>
                )}
              </div>

              {/* Instructions */}
              <p className="text-xs font-semibold text-zinc-700 max-w-xs leading-snug">
                Aponte a câmera do seu celular para abrir o cardápio e pedir diretamente desta mesa.
              </p>

              {/* Wi-Fi footnote */}
              {config.wifiName && (
                <div className="mt-5 pt-4 border-t border-zinc-200 w-full flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
                  <Wifi className="w-3.5 h-3.5 text-amber-600" />
                  <span>Wi-Fi: <strong>{config.wifiName}</strong></span>
                  <span>•</span>
                  <span>Senha: <strong>{config.wifiPassword}</strong></span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-zinc-400 mt-3 text-center">
              Dica: Clique em "Imprimir Placas" no canto superior para enviar direto à sua impressora.
            </p>
          </div>

        </div>
      ) : (
        /* Mode 2: Batch Grid for Printing All Tables */
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-zinc-100 p-4 rounded-2xl">
            <span className="text-xs font-bold text-zinc-700">
              Exibindo todas as {config.totalTables} placas de mesa formatadas para impressão em folha A4.
            </span>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Imprimir Todas ({config.totalTables} mesas)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {batchQrs.map(({ table, dataUrl }) => (
              <div
                key={table}
                className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs text-center flex flex-col items-center page-break-inside-avoid"
              >
                <div className="text-xs font-bold uppercase text-zinc-400">
                  {config.name}
                </div>
                <div className="text-lg font-black text-zinc-900 mt-1 mb-2 font-display">
                  MESA {table}
                </div>
                {dataUrl && (
                  <img
                    src={dataUrl}
                    alt={`QR Mesa ${table}`}
                    className="w-36 h-36 border border-zinc-200 rounded-xl p-1 shadow-2xs mb-2"
                  />
                )}
                <span className="text-[10px] text-zinc-500 font-medium">
                  Escaneie para fazer seu pedido
                </span>
                <button
                  onClick={() => {
                    setSelectedTable(table);
                    setBatchMode(false);
                  }}
                  className="mt-3 text-[11px] text-amber-600 font-bold hover:underline"
                >
                  Personalizar esta mesa
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
