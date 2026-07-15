import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission, PermissionKey } from './schemas/permission.schema';

const SEED_PERMISSIONS: { key: PermissionKey; label: string; group: string; description?: string }[] = [
  { key: PermissionKey.VIEW_DASHBOARD, label: 'Ver Dashboard', group: 'Dashboard', description: 'Acceder al panel principal' },
  { key: PermissionKey.VIEW_EVENTS, label: 'Ver Eventos', group: 'Eventos', description: 'Listar y ver eventos' },
  { key: PermissionKey.CREATE_EVENT, label: 'Crear Evento', group: 'Eventos', description: 'Crear nuevos eventos' },
  { key: PermissionKey.EDIT_EVENT, label: 'Editar Evento', group: 'Eventos', description: 'Modificar eventos existentes' },
  { key: PermissionKey.DELETE_EVENT, label: 'Eliminar Evento', group: 'Eventos', description: 'Eliminar eventos' },
  { key: PermissionKey.VIEW_DEVICES, label: 'Ver Dispositivos', group: 'Dispositivos', description: 'Listar y ver dispositivos' },
  { key: PermissionKey.CREATE_DEVICE, label: 'Crear Dispositivo', group: 'Dispositivos', description: 'Registrar nuevos dispositivos' },
  { key: PermissionKey.EDIT_DEVICE, label: 'Editar Dispositivo', group: 'Dispositivos', description: 'Modificar dispositivos existentes' },
  { key: PermissionKey.DELETE_DEVICE, label: 'Eliminar Dispositivo', group: 'Dispositivos', description: 'Eliminar dispositivos' },
  { key: PermissionKey.VIEW_USERS, label: 'Ver Usuarios', group: 'Usuarios', description: 'Listar y ver usuarios' },
  { key: PermissionKey.CREATE_USER, label: 'Crear Usuario', group: 'Usuarios', description: 'Crear nuevos usuarios' },
  { key: PermissionKey.EDIT_USER, label: 'Editar Usuario', group: 'Usuarios', description: 'Modificar datos de usuarios' },
  { key: PermissionKey.DELETE_USER, label: 'Eliminar Usuario', group: 'Usuarios', description: 'Eliminar usuarios' },
  { key: PermissionKey.MANAGE_ROLES, label: 'Gestionar Roles', group: 'Sistema', description: 'Crear, editar y asignar roles y permisos' },
  { key: PermissionKey.VIEW_VOTING, label: 'Ver Votaciones', group: 'Votacion', description: 'Acceder al modulo de votacion' },
  { key: PermissionKey.CAST_VOTE, label: 'Votar', group: 'Votacion', description: 'Emitir votos en una asamblea' },
];

@Injectable()
export class PermissionsService implements OnModuleInit {
  constructor(@InjectModel(Permission.name) private permModel: Model<Permission>) {}

  async onModuleInit() {
    const count = await this.permModel.countDocuments();
    if (count === 0) {
      await this.permModel.insertMany(SEED_PERMISSIONS);
    }
  }

  findAll(): Promise<Permission[]> {
    return this.permModel.find().exec();
  }

  findByIds(ids: string[]): Promise<Permission[]> {
    return this.permModel.find({ _id: { $in: ids } }).exec();
  }

  findByKeys(keys: string[]): Promise<Permission[]> {
    return this.permModel.find({ key: { $in: keys } }).exec();
  }
}
