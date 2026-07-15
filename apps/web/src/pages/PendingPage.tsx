import { useAuthStore } from '../stores/auth.store';
import { Vote, MessageCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PendingPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-5">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-2xl bg-amber/10 border border-amber/20 flex items-center justify-center mx-auto mb-8">
          <Vote size={40} className="text-amber" strokeWidth={1.8} />
        </div>

        <h1 className="text-3xl font-display font-800 text-white mb-4">
          Cuenta pendiente de aprobacion
        </h1>

        <p className="text-gray-400 text-[16px] leading-relaxed mb-3">
          Hola <span className="text-white font-medium">{user?.name}</span>, tu cuenta esta esperando ser aprobada por un administrador.
        </p>

        <p className="text-gray-500 text-[15px] leading-relaxed mb-10">
          Contactanos por WhatsApp para que active tu acceso al sistema.
        </p>

        <a
          href="https://wa.me/573001234567?text=Hola%2C%20necesito%20activar%20mi%20cuenta%20en%20ControlProject"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-green hover:bg-green-dim text-navy font-semibold text-[16px] rounded-xl transition-all duration-200 mb-6"
        >
          <MessageCircle size={22} strokeWidth={2} />
          Contactar por WhatsApp
        </a>

        <div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-400 text-[14px] transition-colors"
          >
            <LogOut size={16} strokeWidth={1.8} />
            Cerrar sesion
          </button>
        </div>
      </div>
    </div>
  );
}
