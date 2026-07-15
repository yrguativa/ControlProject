import { useParams } from 'react-router-dom';
import { useEventResults, useCastVote } from '../hooks/use-api';
import { VoteOption } from '../types';
import { motion } from 'framer-motion';
import { Check, X, Minus, BarChart3, Users, TrendingUp } from 'lucide-react';

const voteOptions = [
  {
    option: VoteOption.SI,
    label: 'SI',
    description: 'A favor',
    color: 'bg-green/10 border-green/30 text-green hover:bg-green/20 hover:border-green/50',
    barColor: 'bg-green',
    icon: Check,
  },
  {
    option: VoteOption.NO,
    label: 'NO',
    description: 'En contra',
    color: 'bg-red/10 border-red/30 text-red hover:bg-red/20 hover:border-red/50',
    barColor: 'bg-red',
    icon: X,
  },
  {
    option: VoteOption.ABSTENCION,
    label: 'ABSTENCION',
    description: 'Abstencion',
    color: 'bg-amber/10 border-amber/30 text-amber hover:bg-amber/20 hover:border-amber/50',
    barColor: 'bg-amber',
    icon: Minus,
  },
];

export default function VotingPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: results } = useEventResults(eventId || null);
  const castVote = useCastVote();

  const handleVote = (option: VoteOption) => {
    castVote.mutate({
      deviceId: 'web-user',
      eventId: eventId!,
      vote: option,
    });
  };

  return (
    <div className="space-y-8 max-w-[1200px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-800 text-navy">Votacion en vivo</h1>
        <p className="text-gray-stone mt-2 text-[15px]">Emite tu voto y observa los resultados en tiempo real</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vote buttons */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-smoke p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-navy/5 border border-gray-smoke flex items-center justify-center">
              <Check size={20} className="text-navy" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-display font-800 text-navy">Emitir voto</h2>
              <p className="text-sm text-gray-stone">Selecciona tu opcion</p>
            </div>
          </div>

          <div className="space-y-4">
            {voteOptions.map(({ option, label, description, color, icon: Icon }) => (
              <button
                key={option}
                onClick={() => handleVote(option)}
                disabled={castVote.isPending}
                className={`w-full flex items-center gap-4 py-5 px-6 rounded-2xl border-2 font-display font-800 text-lg transition-all duration-200 ${color} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center flex-shrink-0">
                  <Icon size={24} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="text-xl">{label}</p>
                  <p className="text-sm font-body font-normal opacity-70">{description}</p>
                </div>
              </button>
            ))}
          </div>

          {castVote.isPending && (
            <div className="mt-4 text-center">
              <div className="w-6 h-6 border-2 border-navy/20 border-t-navy rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-stone mt-2">Enviando voto...</p>
            </div>
          )}
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-smoke p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-navy/5 border border-gray-smoke flex items-center justify-center">
              <BarChart3 size={20} className="text-navy" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-display font-800 text-navy">Resultados</h2>
              <p className="text-sm text-gray-stone">En tiempo real</p>
            </div>
          </div>

          {results && (
            <div className="space-y-6">
              {/* Total votes */}
              <div className="flex items-center gap-4 p-5 bg-gray-mist rounded-2xl border border-gray-smoke">
                <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center">
                  <Users size={24} className="text-white" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-3xl font-display font-800 text-navy tracking-tight">{results.totalVotes}</p>
                  <p className="text-sm text-gray-stone font-medium">Votos totales</p>
                </div>
              </div>

              {/* Results bars */}
              {results.results.map((r, i) => (
                <motion.div
                  key={r.option}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-800 text-navy text-lg">{r.option}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-stone">
                        {r.count} voto{r.count !== 1 ? 's' : ''}
                      </span>
                      <span className="text-sm font-bold text-navy bg-gray-mist px-2.5 py-0.5 rounded-full">
                        {r.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-mist rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${r.percentage}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.5 + i * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`h-full rounded-full ${
                        r.option === VoteOption.SI
                          ? 'bg-green'
                          : r.option === VoteOption.NO
                          ? 'bg-red'
                          : 'bg-amber'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!results && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-mist flex items-center justify-center mb-4">
                <TrendingUp size={28} className="text-gray-stone" strokeWidth={1.5} />
              </div>
              <p className="text-gray-stone">Esperando resultados...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
