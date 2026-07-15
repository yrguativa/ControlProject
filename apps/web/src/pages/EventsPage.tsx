import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useEvents,
  useCreateEvent,
  useActivateEvent,
  useEndEvent,
} from '../hooks/use-api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Play,
  Square,
  Eye,
  Calendar,
  MapPin,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
} from 'date-fns';
import { es } from 'date-fns/locale';

const ITEMS_PER_PAGE = 5;

export default function EventsPage() {
  const { data: events, isLoading } = useEvents();
  const createEvent = useCreateEvent();
  const activateEvent = useActivateEvent();
  const endEvent = useEndEvent();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    location: '',
    startTime: '',
    totalCoeficiente: 100,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const handleCreate = async () => {
    await createEvent.mutateAsync({
      input: { ...form, startTime: form.startTime || new Date().toISOString() },
    });
    setShowForm(false);
    setForm({ name: '', location: '', startTime: '', totalCoeficiente: 100 });
  };

  // Calendar logic
  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(calendarMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calStart, end: calEnd });

  const eventDates = useMemo(() => {
    if (!events) return new Set<string>();
    const dates = new Set<string>();
    events.forEach((ev) => {
      const d = new Date(ev.startTime);
      dates.add(format(d, 'yyyy-MM-dd'));
    });
    return dates;
  }, [events]);

  const eventsOnSelectedDate = useMemo(() => {
    if (!events) return [];
    return events.filter((ev) => isSameDay(new Date(ev.startTime), selectedDate));
  }, [events, selectedDate]);

  // Pagination
  const sortedEvents = useMemo(() => {
    if (!events) return [];
    return [...events].sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );
  }, [events]);

  const totalPages = Math.ceil(sortedEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = sortedEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const weekDays = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-800 text-navy">Eventos</h1>
          <p className="text-gray-stone mt-2 text-[15px]">Gestiona las asambleas y votaciones</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2.5 px-6 py-3.5 bg-green text-navy font-semibold rounded-xl hover:bg-green-dim transition-all shadow-sm shadow-green/20"
        >
          <Plus size={20} strokeWidth={2} />
          Nuevo evento
        </button>
      </motion.div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-gray-smoke p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-800 text-navy">Crear evento</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-gray-stone hover:text-navy hover:bg-gray-mist rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">Nombre del evento</label>
                  <input
                    placeholder="Ej: Asamblea ordinaria 2025"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-4 border border-gray-smoke rounded-xl text-[15px] text-navy placeholder:text-gray-stone/50 focus:outline-none focus:border-green focus:ring-2 focus:ring-green/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">Ubicacion</label>
                  <input
                    placeholder="Ej: Salon principal"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-4 border border-gray-smoke rounded-xl text-[15px] text-navy placeholder:text-gray-stone/50 focus:outline-none focus:border-green focus:ring-2 focus:ring-green/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">Fecha y hora</label>
                  <input
                    type="datetime-local"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full px-4 py-4 border border-gray-smoke rounded-xl text-[15px] text-navy focus:outline-none focus:border-green focus:ring-2 focus:ring-green/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">Total coeficiente</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={form.totalCoeficiente}
                    onChange={(e) => setForm({ ...form, totalCoeficiente: +e.target.value })}
                    className="w-full px-4 py-4 border border-gray-smoke rounded-xl text-[15px] text-navy placeholder:text-gray-stone/50 focus:outline-none focus:border-green focus:ring-2 focus:ring-green/10 transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreate}
                  disabled={createEvent.isPending || !form.name}
                  className="px-6 py-4 bg-green text-navy font-semibold rounded-xl hover:bg-green-dim transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createEvent.isPending ? 'Creando...' : 'Crear evento'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-4 border border-gray-smoke rounded-xl text-gray-stone font-medium hover:bg-gray-mist transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar + Events grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-smoke p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-display font-800 text-navy capitalize">
              {format(calendarMonth, 'MMMM yyyy', { locale: es })}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
                className="p-2 text-gray-stone hover:text-navy hover:bg-gray-mist rounded-xl transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
                className="p-2 text-gray-stone hover:text-navy hover:bg-gray-mist rounded-xl transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Week headers */}
          <div className="calendar-grid mb-2">
            {weekDays.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-gray-stone py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="calendar-grid">
            {calendarDays.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const hasEvent = eventDates.has(dateStr);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, calendarMonth);
              const today = isToday(day);

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(day)}
                  className={`calendar-day text-[13px] font-medium ${
                    !isCurrentMonth ? 'other-month' : ''
                  } ${today ? 'today' : ''} ${isSelected && !today ? 'selected' : ''} ${
                    hasEvent ? 'has-event' : ''
                  }`}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>

          {/* Selected date events */}
          {eventsOnSelectedDate.length > 0 && (
            <div className="mt-5 pt-5 border-t border-gray-mist">
              <p className="text-sm font-semibold text-navy mb-3">
                {format(selectedDate, 'd ')} de {format(selectedDate, 'MMMM', { locale: es })}
              </p>
              <div className="space-y-2">
                {eventsOnSelectedDate.map((ev) => (
                  <div
                    key={ev._id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-mist border border-gray-smoke"
                  >
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        ev.active ? 'bg-green' : 'bg-gray-stone'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy truncate">{ev.name}</p>
                      <p className="text-xs text-gray-stone">{ev.location}</p>
                    </div>
                    {ev.active && (
                      <span className="text-xs font-semibold text-green bg-green/10 px-2 py-0.5 rounded-full">
                        Activo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Events list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-stone">
              {sortedEvents.length} evento{sortedEvents.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="space-y-3">
            {paginatedEvents.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-smoke p-6 hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        event.active ? 'bg-green/10 border border-green/20' : 'bg-gray-mist border border-gray-smoke'
                      }`}
                    >
                      <Calendar
                        size={24}
                        className={event.active ? 'text-green' : 'text-gray-stone'}
                        strokeWidth={1.8}
                      />
                    </div>
                    <div>
                      <p className="text-lg font-display font-800 text-navy">{event.name}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-stone">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} />
                          {new Date(event.startTime).toLocaleDateString('es-CO', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <BarChart3 size={13} />
                          {event.totalCoeficiente} coef.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-[72px] sm:ml-0">
                    {event.active ? (
                      <>
                        <button
                          onClick={() => navigate(`/voting/${event._id}`)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-green/10 text-green rounded-xl text-sm font-semibold hover:bg-green/20 transition-all border border-green/20"
                        >
                          <Eye size={16} strokeWidth={2} />
                          Ver votacion
                        </button>
                        <button
                          onClick={() => endEvent.mutate({ id: event._id })}
                          className="flex items-center gap-2 px-4 py-2.5 bg-red/10 text-red rounded-xl text-sm font-semibold hover:bg-red/20 transition-all border border-red/20"
                        >
                          <Square size={16} strokeWidth={2} />
                          Finalizar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => activateEvent.mutate({ id: event._id })}
                        className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light transition-all"
                      >
                        <Play size={16} strokeWidth={2} />
                        Activar
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
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
          {!isLoading && sortedEvents.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-smoke">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gray-mist flex items-center justify-center mb-6">
                <Calendar size={36} className="text-gray-stone" strokeWidth={1.5} />
              </div>
              <p className="text-lg font-display font-800 text-navy mb-2">No hay eventos creados</p>
              <p className="text-gray-stone">Crea tu primer evento para empezar a votar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
