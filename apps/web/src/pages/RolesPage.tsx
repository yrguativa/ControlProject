import { useState } from 'react';
import { useRoles, usePermissions, useCreateRole, useUpdateRole, useDeleteRole } from '../hooks/use-api';
import { Shield, Plus, Trash2, Edit3, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Role, Permission } from '../types';

export default function RolesPage() {
  const { data: roles, isLoading } = useRoles();
  const { data: permissions } = usePermissions();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const permGroups = permissions
    ? permissions.reduce((acc: Record<string, Permission[]>, p) => {
        if (!acc[p.group]) acc[p.group] = [];
        acc[p.group].push(p);
        return acc;
      }, {})
    : {};

  const togglePerm = (id: string) => {
    setSelectedPerms((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleGroup = (group: string) => {
    const groupPerms = permGroups[group] || [];
    const allSelected = groupPerms.every((p) => selectedPerms.includes(p._id));
    if (allSelected) {
      setSelectedPerms((prev) => prev.filter((id) => !groupPerms.some((p) => p._id === id)));
    } else {
      setSelectedPerms((prev) => [...new Set([...prev, ...groupPerms.map((p) => p._id)])]);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createRole.mutateAsync({ input: { name: name.trim(), permissionIds: selectedPerms } });
    setName('');
    setSelectedPerms([]);
    setShowCreate(false);
  };

  const handleEdit = (role: Role) => {
    setEditId(role._id);
    setName(role.name);
    setSelectedPerms(role.permissions.map((p) => p._id));
  };

  const handleSaveEdit = async () => {
    if (!editId) return;
    await updateRole.mutateAsync({ id: editId, input: { name, permissionIds: selectedPerms } });
    setEditId(null);
    setName('');
    setSelectedPerms([]);
  };

  const handleDelete = async (id: string) => {
    await deleteRole.mutateAsync({ id });
    setDeleteConfirm(null);
  };

  const handleCancel = () => {
    setShowCreate(false);
    setEditId(null);
    setName('');
    setSelectedPerms([]);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 skeleton rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-display font-800 text-navy">Roles y Permisos</h1>
          <p className="text-gray-stone text-[15px] mt-1">Gestiona los roles y sus permisos de acceso</p>
        </div>
        <button
          onClick={() => { handleCancel(); setShowCreate(true); }}
          className="flex items-center gap-2.5 px-6 py-3.5 bg-green hover:bg-green-dim text-navy font-semibold text-[15px] rounded-xl transition-all duration-200"
        >
          <Plus size={20} strokeWidth={2} />
          Nuevo rol
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-white rounded-2xl border border-gray-smoke p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-navy">Crear nuevo rol</h3>
            <button onClick={handleCancel} className="p-2 text-gray-stone hover:text-navy rounded-xl hover:bg-gray-mist">
              <X size={18} />
            </button>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del rol"
            className="w-full px-4 py-3.5 bg-navy-light border border-white/10 rounded-xl text-white text-[15px] placeholder:text-gray-600 focus:outline-none focus:border-green/50 focus:ring-2 focus:ring-green/10 transition-all"
          />
          <PermSelector
            permGroups={permGroups}
            expandedGroup={expandedGroup}
            setExpandedGroup={setExpandedGroup}
            selectedPerms={selectedPerms}
            togglePerm={togglePerm}
            toggleGroup={toggleGroup}
          />
          <button
            onClick={handleCreate}
            disabled={!name.trim() || createRole.isPending}
            className="px-6 py-3.5 bg-green hover:bg-green-dim text-navy font-semibold rounded-xl transition-all disabled:opacity-40"
          >
            {createRole.isPending ? 'Creando...' : 'Crear rol'}
          </button>
        </div>
      )}

      {/* Roles list */}
      <div className="space-y-3">
        {roles?.map((role) => (
          <div key={role._id} className="bg-white rounded-2xl border border-gray-smoke">
            {editId === role._id ? (
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-navy">Editar rol</h3>
                  <button onClick={handleCancel} className="p-2 text-gray-stone hover:text-navy rounded-xl hover:bg-gray-mist">
                    <X size={18} />
                  </button>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-navy-light border border-white/10 rounded-xl text-white text-[15px] placeholder:text-gray-600 focus:outline-none focus:border-green/50 focus:ring-2 focus:ring-green/10 transition-all"
                />
                <PermSelector
                  permGroups={permGroups}
                  expandedGroup={expandedGroup}
                  setExpandedGroup={setExpandedGroup}
                  selectedPerms={selectedPerms}
                  togglePerm={togglePerm}
                  toggleGroup={toggleGroup}
                />
                <button
                  onClick={handleSaveEdit}
                  disabled={!name.trim() || updateRole.isPending}
                  className="px-6 py-3.5 bg-green hover:bg-green-dim text-navy font-semibold rounded-xl transition-all disabled:opacity-40"
                >
                  {updateRole.isPending ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet/10 border border-violet/20 flex items-center justify-center">
                      <Shield size={22} className="text-violet" strokeWidth={1.8} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[16px] font-semibold text-navy">{role.name}</h3>
                        {role.isDefault && (
                          <span className="px-2 py-0.5 bg-blue/10 text-blue text-xs font-medium rounded-lg">
                            Predeterminado
                          </span>
                        )}
                      </div>
                      <p className="text-gray-stone text-[13px] mt-0.5">
                        {role.permissions.length} permiso{role.permissions.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(role)}
                      className="p-2.5 text-gray-stone hover:text-navy hover:bg-gray-mist rounded-xl transition-colors"
                    >
                      <Edit3 size={18} strokeWidth={1.8} />
                    </button>
                    {!role.isDefault && (
                      deleteConfirm === role._id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(role._id)}
                            className="p-2.5 text-white bg-red rounded-xl hover:bg-red/90 transition-colors"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="p-2.5 text-gray-stone hover:bg-gray-mist rounded-xl transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(role._id)}
                          className="p-2.5 text-gray-stone hover:text-red hover:bg-red/10 rounded-xl transition-colors"
                        >
                          <Trash2 size={18} strokeWidth={1.8} />
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Permission badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {role.permissions.map((p) => (
                    <span key={p._id} className="px-3 py-1.5 bg-gray-mist text-gray-stone text-[13px] font-medium rounded-lg">
                      {p.label}
                    </span>
                  ))}
                  {role.permissions.length === 0 && (
                    <span className="text-gray-500 text-[13px] italic">Sin permisos asignados</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PermSelector({
  permGroups,
  expandedGroup,
  setExpandedGroup,
  selectedPerms,
  togglePerm,
  toggleGroup,
}: {
  permGroups: Record<string, Permission[]>;
  expandedGroup: string | null;
  setExpandedGroup: (g: string | null) => void;
  selectedPerms: string[];
  togglePerm: (id: string) => void;
  toggleGroup: (group: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-stone">Permisos</p>
      {Object.entries(permGroups).map(([group, perms]) => {
        const allSelected = perms.every((p) => selectedPerms.includes(p._id));
        const someSelected = perms.some((p) => selectedPerms.includes(p._id)) && !allSelected;
        const isExpanded = expandedGroup === group;

        return (
          <div key={group} className="border border-gray-smoke rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedGroup(isExpanded ? null : group)}
              className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-mist transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer',
                    allSelected ? 'bg-green border-green' : someSelected ? 'bg-green/20 border-green/40' : 'border-gray-smoke',
                  )}
                  onClick={(e) => { e.stopPropagation(); toggleGroup(group); }}
                >
                  {(allSelected || someSelected) && <Check size={12} className={allSelected ? 'text-navy' : 'text-green'} />}
                </div>
                <span className="text-[14px] font-medium text-navy">{group}</span>
              </div>
              {isExpanded ? <ChevronUp size={16} className="text-gray-stone" /> : <ChevronDown size={16} className="text-gray-stone" />}
            </button>
            {isExpanded && (
              <div className="border-t border-gray-smoke px-4 py-3 space-y-2">
                {perms.map((p) => (
                  <label key={p._id} className="flex items-center gap-3 cursor-pointer py-1">
                    <div
                      className={cn(
                        'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
                        selectedPerms.includes(p._id) ? 'bg-green border-green' : 'border-gray-smoke',
                      )}
                      onClick={() => togglePerm(p._id)}
                    >
                      {selectedPerms.includes(p._id) && <Check size={12} className="text-navy" />}
                    </div>
                    <div>
                      <span className="text-[14px] text-navy">{p.label}</span>
                      {p.description && <span className="text-[13px] text-gray-stone ml-2">- {p.description}</span>}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
