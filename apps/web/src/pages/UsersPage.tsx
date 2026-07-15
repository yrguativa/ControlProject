import { useMemo, useState } from 'react';
import { useUsers, useRoles, useUpdateUserRole, useApproveUser, useToggleUserActive } from '../hooks/use-api';
import { useAuthStore } from '../stores/auth.store';
import { motion } from 'framer-motion';
import {
  Users,
  Shield,
  Eye,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Check,
  X,
} from 'lucide-react';
import { cn } from '../lib/utils';

const ITEMS_PER_PAGE = 8;

const roleColors: Record<string, string> = {
  ADMIN: 'bg-red/10 text-red border-red/20',
  OPERATOR: 'bg-blue/10 text-blue border-blue/20',
  VIEWER: 'bg-gray-mist text-gray-stone border-gray-smoke',
};

const roleIcons: Record<string, any> = {
  ADMIN: Shield,
  OPERATOR: Settings,
  VIEWER: Eye,
};

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const { data: roles } = useRoles();
  const updateRole = useUpdateUserRole();
  const approveUser = useApproveUser();
  const toggleActive = useToggleUserActive();
  const currentUser = useAuthStore((s) => s.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const totalPages = Math.ceil((users?.length || 0) / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    if (!users) return [];
    return users.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
  }, [users, currentPage]);

  const activeCount = users?.filter((u) => u.active).length || 0;
  const pendingCount = users?.filter((u) => !u.approved).length || 0;
  const adminCount = users?.filter((u) => {
    const roleName = typeof u.role === 'string' ? u.role : u.role?.name;
    return roleName === 'ADMIN';
  }).length || 0;

  const getRoleName = (role: any): string => {
    if (typeof role === 'string') return role;
    return role?.name || 'VIEWER';
  };

  const handleRoleChange = async (userId: string, roleId: string) => {
    await updateRole.mutateAsync({ id: userId, roleId });
    setEditingRole(null);
  };

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-800 text-navy">Usuarios</h1>
        <p className="text-gray-stone mt-2 text-[15px]">Gestiona los usuarios del sistema</p>
      </motion.div>

      {/* Stats */}
      {users && users.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-gray-smoke p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center">
              <Users size={26} className="text-navy" />
            </div>
            <div>
              <p className="text-[15px] text-gray-stone">Total usuarios</p>
              <p className="text-3xl font-display font-800 text-navy">{users.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-smoke p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-green/10 flex items-center justify-center">
              <UserCheck size={26} className="text-green" />
            </div>
            <div>
              <p className="text-[15px] text-gray-stone">Activos</p>
              <p className="text-3xl font-display font-800 text-navy">{activeCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-smoke p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber/10 flex items-center justify-center">
              <UserX size={26} className="text-amber" />
            </div>
            <div>
              <p className="text-[15px] text-gray-stone">Pendientes</p>
              <p className="text-3xl font-display font-800 text-navy">{pendingCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-smoke p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-red/10 flex items-center justify-center">
              <Shield size={26} className="text-red" />
            </div>
            <div>
              <p className="text-[15px] text-gray-stone">Administradores</p>
              <p className="text-3xl font-display font-800 text-navy">{adminCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-smoke overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-mist bg-gray-mist/50">
                <th className="text-left px-8 py-4 text-xs font-semibold text-gray-stone uppercase tracking-wider">
                  Usuario
                </th>
                <th className="text-left px-8 py-4 text-xs font-semibold text-gray-stone uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-8 py-4 text-xs font-semibold text-gray-stone uppercase tracking-wider">
                  Rol
                </th>
                <th className="text-left px-8 py-4 text-xs font-semibold text-gray-stone uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-left px-8 py-4 text-xs font-semibold text-gray-stone uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, i) => {
                const roleName = getRoleName(user.role);
                const color = roleColors[roleName] || roleColors.VIEWER;
                const RoleIcon = roleIcons[roleName] || Eye;
                const isCurrentUser = user._id === currentUser?.userId;
                return (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={cn(
                      'border-b border-gray-mist/50 hover:bg-gray-mist/30 transition-colors',
                      isCurrentUser && 'bg-green/[0.02]',
                      !user.approved && 'bg-amber/[0.02]',
                    )}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-display font-800 text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-navy text-[15px]">
                            {user.name}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-green font-medium">(tu)</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-gray-stone text-[15px]">{user.email}</td>
                    <td className="px-8 py-5">
                      {editingRole === user._id ? (
                        <div className="flex items-center gap-1">
                          {roles?.map((role) => (
                            <button
                              key={role._id}
                              onClick={() => handleRoleChange(user._id, role._id)}
                              className={cn(
                                'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                                roleName === role.name
                                  ? 'bg-green text-navy border-green'
                                  : 'bg-white text-gray-stone border-gray-smoke hover:border-green/50',
                              )}
                            >
                              {role.name}
                            </button>
                          ))}
                          <button
                            onClick={() => setEditingRole(null)}
                            className="p-1.5 text-gray-stone hover:text-navy rounded-lg hover:bg-gray-mist"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingRole(user._id)}
                          className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer hover:opacity-80 transition-opacity',
                            color,
                          )}
                        >
                          <RoleIcon size={13} strokeWidth={2} />
                          {roleName}
                        </button>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'inline-flex items-center gap-2 text-sm font-medium',
                            user.active ? 'text-green' : 'text-gray-stone',
                          )}
                        >
                          <span className={cn('w-2.5 h-2.5 rounded-full', user.active ? 'bg-green' : 'bg-gray-smoke')} />
                          {user.active ? 'Activo' : 'Inactivo'}
                        </span>
                        {!user.approved && (
                          <span className="px-2 py-0.5 bg-amber/10 text-amber text-xs font-medium rounded-lg">
                            Pendiente
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        {!user.approved && (
                          <button
                            onClick={() => approveUser.mutateAsync({ id: user._id })}
                            disabled={approveUser.isPending}
                            className="px-3 py-1.5 bg-green/10 text-green text-xs font-semibold rounded-lg hover:bg-green/20 transition-colors disabled:opacity-40"
                          >
                            Aprobar
                          </button>
                        )}
                        {!isCurrentUser && (
                          <button
                            onClick={() => toggleActive.mutateAsync({ id: user._id })}
                            disabled={toggleActive.isPending}
                            className={cn(
                              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors disabled:opacity-40',
                              user.active
                                ? 'bg-red/10 text-red hover:bg-red/20'
                                : 'bg-green/10 text-green hover:bg-green/20',
                            )}
                          >
                            {user.active ? 'Desactivar' : 'Activar'}
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-8 py-5 border-t border-gray-mist bg-gray-mist/30">
            <p className="text-sm text-gray-stone">
              Pagina {currentPage} de {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-smoke rounded-xl text-sm font-medium text-navy hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'w-11 h-11 rounded-xl text-sm font-semibold transition-all',
                    page === currentPage
                      ? 'bg-navy text-white'
                      : 'text-navy hover:bg-white border border-gray-smoke',
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-smoke rounded-xl text-sm font-medium text-navy hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Empty state */}
      {!isLoading && users?.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-smoke">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gray-mist flex items-center justify-center mb-6">
            <Users size={36} className="text-gray-stone" strokeWidth={1.5} />
          </div>
          <p className="text-lg font-display font-800 text-navy mb-2">No hay usuarios registrados</p>
          <p className="text-gray-stone">Los usuarios apareceran aqui una vez se registren</p>
        </div>
      )}
    </div>
  );
}
