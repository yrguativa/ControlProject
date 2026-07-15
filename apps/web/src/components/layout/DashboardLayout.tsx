import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { useAppStore } from '../../stores/app.store';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Calendar,
  Monitor,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  ChevronDown,
  Vote,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/events', label: 'Eventos', icon: Calendar, roles: ['ADMIN', 'OPERATOR'] },
  { to: '/devices', label: 'Dispositivos', icon: Monitor, roles: ['ADMIN', 'OPERATOR'] },
  { to: '/users', label: 'Usuarios', icon: Users, roles: ['ADMIN'] },
];

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  OPERATOR: 'Operador',
  VIEWER: 'Observador',
};

const routeLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/events': 'Eventos',
  '/devices': 'Dispositivos',
  '/users': 'Usuarios',
};

export default function DashboardLayout() {
  const { user, logout, hasRole } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNav = navItems.filter((item) => hasRole(...(item.roles as any[])));

  const currentLabel = routeLabels[location.pathname] || 'Dashboard';

  const sidebar = (
    <aside
      className={cn(
        'flex flex-col bg-navy transition-all duration-300 h-full',
        sidebarOpen ? 'w-[272px]' : 'w-[80px]',
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center h-[80px] border-b border-white/5', sidebarOpen ? 'px-6' : 'px-0 justify-center')}>
        {sidebarOpen ? (
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center flex-shrink-0">
              <Vote size={22} className="text-green" strokeWidth={2} />
            </div>
            <span className="text-white font-display font-800 text-lg tracking-tight">ControlProject</span>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center">
            <Vote size={22} className="text-green" strokeWidth={2} />
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {filteredNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200',
                isActive
                  ? 'bg-green/10 text-green'
                  : 'text-gray-400 hover:text-white hover:bg-white/5',
                !sidebarOpen && 'justify-center px-0',
              )
            }
          >
            <item.icon size={22} strokeWidth={1.8} />
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-white/5 p-3">
        {sidebarOpen ? (
          <div className="flex items-center gap-3.5 px-4 py-3 rounded-xl mb-2 bg-white/[0.03]">
            <div className="w-10 h-10 rounded-full bg-green/10 border border-green/20 flex items-center justify-center flex-shrink-0">
              <span className="text-green font-display font-800 text-base">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[15px] font-medium truncate">{user?.name}</p>
              <p className="text-gray-500 text-xs truncate">{roleLabels[user?.role || ''] || user?.role}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-2">
            <div className="w-10 h-10 rounded-full bg-green/10 border border-green/20 flex items-center justify-center">
              <span className="text-green font-display font-800 text-base">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3.5 w-full px-4 py-3.5 rounded-xl text-[15px] text-gray-400 hover:text-red hover:bg-red/10 transition-all duration-200',
            !sidebarOpen && 'justify-center px-0',
          )}
        >
          <LogOut size={22} strokeWidth={1.8} />
          {sidebarOpen && <span>Cerrar sesion</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-mist">
      {/* Desktop sidebar */}
      <div className="hidden lg:block h-full">
        {sidebar}
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 h-full animate-slide-in-left">
            {sidebar}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Topbar */}
        <header className="h-[80px] border-b border-gray-smoke bg-white flex items-center justify-between px-5 lg:px-8 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 -ml-2 text-gray-stone hover:text-navy transition-colors rounded-xl hover:bg-gray-mist"
            >
              <Menu size={24} strokeWidth={1.8} />
            </button>
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-2.5 -ml-2 text-gray-stone hover:text-navy transition-colors rounded-xl hover:bg-gray-mist"
            >
              {sidebarOpen ? <X size={22} strokeWidth={1.8} /> : <Menu size={22} strokeWidth={1.8} />}
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2.5 ml-1">
              <span className="text-[15px] text-gray-stone">ControlProject</span>
              <ChevronRight size={16} className="text-gray-smoke" />
              <span className="text-[15px] font-semibold text-navy">{currentLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-3 text-gray-stone hover:text-navy transition-colors rounded-xl hover:bg-gray-mist">
              <Search size={22} strokeWidth={1.8} />
            </button>
            <button className="relative p-3 text-gray-stone hover:text-navy transition-colors rounded-xl hover:bg-gray-mist">
              <Bell size={22} strokeWidth={1.8} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-green rounded-full" />
            </button>

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 pl-3 pr-3 py-2 rounded-xl hover:bg-gray-mist transition-colors ml-1"
              >
                <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center">
                  <span className="text-white font-display font-800 text-sm">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-[15px] font-medium text-navy leading-tight">{user?.name}</p>
                  <p className="text-xs text-gray-stone leading-tight">{roleLabels[user?.role || ''] || user?.role}</p>
                </div>
                <ChevronDown size={16} className="text-gray-stone hidden sm:block" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl border border-gray-smoke shadow-xl shadow-black/5 py-2 z-50 animate-scale-in">
                    <div className="px-5 py-4 border-b border-gray-mist">
                      <p className="text-[15px] font-semibold text-navy">{user?.name}</p>
                      <p className="text-xs text-gray-stone mt-1">{user?.email}</p>
                    </div>
                    <div className="py-1.5">
                      <button
                        onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                        className="flex items-center gap-3 w-full px-5 py-3 text-[15px] text-red hover:bg-red/5 transition-colors"
                      >
                        <LogOut size={18} strokeWidth={1.8} />
                        Cerrar sesion
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
