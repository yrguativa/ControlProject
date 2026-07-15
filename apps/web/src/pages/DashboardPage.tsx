import { useEvents, useEventResults, useDevices } from '../hooks/use-api';
import { useAppStore } from '../stores/app.store';
import { motion } from 'framer-motion';
import { Vote, Monitor, BarChart3, Calendar, TrendingUp, Clock, MapPin } from 'lucide-react';

export default function DashboardPage() {
  const { data: events, isLoading } = useEvents();
  const { data: devices } = useDevices();
  const activeEventId = useAppStore((s) => s.activeEventId);
  const { data: results } = useEventResults(activeEventId);

  const activeEvent = events?.find((e) => e.active);

  const stats = [
    {
      label: 'Eventos activos',
      value: events?.filter((e) => e.active).length || 0,
      icon: Calendar,
      color: 'bg-green/10 text-green',
      accent: 'border-l-green',
    },
    {
      label: 'Total eventos',
      value: events?.length || 0,
      icon: BarChart3,
      color: 'bg-blue/10 text-blue',
      accent: 'border-l-blue',
    },
    {
      label: 'Votos registrados',
      value: results?.totalVotes || 0,
      icon: Vote,
      color: 'bg-violet/10 text-violet',
      accent: 'border-l-violet',
    },
    {
      label: 'Dispositivos',
      value: devices?.length || 0,
      icon: Monitor,
      color: 'bg-amber/10 text-amber',
      accent: 'border-l-amber',
    },
  ];

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-display font-800 text-navy">Dashboard</h1>
        <p className="text-gray-stone mt-2 text-[15px]">Resumen del sistema de votacion electronica</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`bg-white rounded-2xl border border-gray-smoke p-7 hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-300 border-l-4 ${stat.accent}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[15px] font-medium text-gray-stone">{stat.label}</p>
                <p className="text-4xl font-display font-800 text-navy mt-2 tracking-tight">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={26} strokeWidth={1.8} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active event */}
      {activeEvent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-white rounded-2xl border border-gray-smoke overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-gray-mist bg-gradient-to-r from-green/[0.03] to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green/10 border border-green/20 flex items-center justify-center">
                  <TrendingUp size={22} className="text-green" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-800 text-navy">Evento activo</h2>
                  <p className="text-gray-stone text-sm mt-0.5">Votacion en curso</p>
                </div>
              </div>
              <span className="px-4 py-1.5 bg-green/10 text-green rounded-full text-sm font-semibold border border-green/20">
                En vivo
              </span>
            </div>
          </div>

          <div className="px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <h3 className="text-2xl font-display font-800 text-navy">{activeEvent.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-stone">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {activeEvent.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {new Date(activeEvent.startTime).toLocaleDateString('es-CO', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {results && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {results.results.map((r) => (
                  <div key={r.option} className="text-center p-6 bg-gray-mist rounded-2xl border border-gray-smoke">
                    <p className="text-3xl font-display font-800 text-navy">{r.count}</p>
                    <p className="text-sm font-medium text-gray-stone mt-1">{r.option}</p>
                    <div className="mt-3">
                      <div className="w-full h-2 bg-gray-smoke rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            r.option === 'SI' ? 'bg-green' : r.option === 'NO' ? 'bg-red' : 'bg-amber'
                          }`}
                          style={{ width: `${r.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-green font-semibold mt-2">{r.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* No active event */}
      {!activeEvent && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-white rounded-2xl border border-gray-smoke p-16 text-center"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gray-mist flex items-center justify-center mb-6">
            <Calendar size={36} className="text-gray-stone" strokeWidth={1.5} />
          </div>
          <p className="text-lg font-display font-800 text-navy mb-2">No hay eventos activos</p>
          <p className="text-gray-stone">Crea un evento desde la seccion Eventos para empezar a votar</p>
        </motion.div>
      )}
    </div>
  );
}
