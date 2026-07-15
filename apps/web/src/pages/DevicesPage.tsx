import { useMemo, useState } from 'react';
import { useDevices } from '../hooks/use-api';
import { motion } from 'framer-motion';
import {
  Monitor,
  Battery,
  BatteryLow,
  BatteryFull,
  BatteryMedium,
  Wifi,
  WifiOff,
  ChevronLeft,
  ChevronRight,
  HardDrive,
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

function getBatteryIcon(level: number) {
  if (level > 66) return BatteryFull;
  if (level > 33) return BatteryMedium;
  return BatteryLow;
}

function getBatteryColor(level: number) {
  if (level > 66) return 'text-green';
  if (level > 33) return 'text-amber';
  return 'text-red';
}

export default function DevicesPage() {
  const { data: devices, isLoading } = useDevices();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((devices?.length || 0) / ITEMS_PER_PAGE);
  const paginatedDevices = useMemo(() => {
    if (!devices) return [];
    return devices.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
  }, [devices, currentPage]);

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-800 text-navy">Dispositivos</h1>
        <p className="text-gray-stone mt-2 text-[15px]">Controles de votacion registrados en el sistema</p>
      </motion.div>

      {/* Stats */}
      {devices && devices.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-gray-smoke p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue/10 flex items-center justify-center">
              <HardDrive size={26} className="text-blue" />
            </div>
            <div>
              <p className="text-[15px] text-gray-stone">Total</p>
              <p className="text-3xl font-display font-800 text-navy">{devices.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-smoke p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-green/10 flex items-center justify-center">
              <Wifi size={26} className="text-green" />
            </div>
            <div>
              <p className="text-[15px] text-gray-stone">Activos</p>
              <p className="text-3xl font-display font-800 text-navy">
                {devices.filter((d) => d.active).length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-smoke p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber/10 flex items-center justify-center">
              <Battery size={26} className="text-amber" />
            </div>
            <div>
              <p className="text-[15px] text-gray-stone">Bateria promedio</p>
              <p className="text-3xl font-display font-800 text-navy">
                {Math.round(devices.reduce((a, d) => a + d.batteryLevel, 0) / devices.length)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Device grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginatedDevices.map((device, i) => {
          const BatteryIcon = getBatteryIcon(device.batteryLevel);
          const batteryColor = getBatteryColor(device.batteryLevel);
          return (
            <motion.div
              key={device._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-smoke p-6 hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-navy/5 border border-gray-smoke flex items-center justify-center">
                  <Monitor size={22} className="text-navy" strokeWidth={1.8} />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      device.active
                        ? 'bg-green/10 text-green border border-green/20'
                        : 'bg-gray-mist text-gray-stone border border-gray-smoke'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${device.active ? 'bg-green' : 'bg-gray-stone'}`} />
                    {device.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              <p className="text-lg font-display font-800 text-navy">
                {device.label || 'Sin etiqueta'}
              </p>
              <p className="text-sm text-gray-stone font-mono mt-1 tracking-wide">
                {device.macAddress}
              </p>

              <div className="flex items-center gap-5 mt-5 pt-5 border-t border-gray-mist">
                <span className={`flex items-center gap-2 text-sm font-medium ${batteryColor}`}>
                  <BatteryIcon size={18} strokeWidth={1.8} />
                  {device.batteryLevel}%
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-stone">
                  {device.active ? (
                    <Wifi size={16} className="text-green" strokeWidth={1.8} />
                  ) : (
                    <WifiOff size={16} strokeWidth={1.8} />
                  )}
                  {device.active ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-stone">
            Pagina {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-smoke rounded-xl text-sm font-medium text-navy hover:bg-gray-mist transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-11 h-11 rounded-xl text-sm font-semibold transition-all ${
                  page === currentPage
                    ? 'bg-navy text-white'
                    : 'text-navy hover:bg-gray-mist border border-gray-smoke'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-smoke rounded-xl text-sm font-medium text-navy hover:bg-gray-mist transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && devices?.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-smoke">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gray-mist flex items-center justify-center mb-6">
            <Monitor size={36} className="text-gray-stone" strokeWidth={1.5} />
          </div>
          <p className="text-lg font-display font-800 text-navy mb-2">No hay dispositivos registrados</p>
          <p className="text-gray-stone">Conecta un control de votacion para que aparezca aqui</p>
        </div>
      )}
    </div>
  );
}
