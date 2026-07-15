import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';
import { Permission, PermissionKey } from '../permissions/schemas/permission.schema';
import { CreateRoleInput, UpdateRoleInput } from './dto/role.dto';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(Permission.name) private permModel: Model<Permission>,
  ) {}

  async onModuleInit() {
    const count = await this.roleModel.countDocuments();
    if (count === 0) {
      const allPerms = await this.permModel.find().exec();
      const allPermIds = allPerms.map((p) => p._id);

      const viewerPerms = allPerms
        .filter((p) =>
          [PermissionKey.VIEW_DASHBOARD, PermissionKey.VIEW_EVENTS, PermissionKey.VIEW_VOTING, PermissionKey.CAST_VOTE].includes(p.key),
        )
        .map((p) => p._id);

      const operatorPerms = allPerms
        .filter((p) =>
          ![
            PermissionKey.MANAGE_ROLES,
            PermissionKey.VIEW_USERS,
            PermissionKey.CREATE_USER,
            PermissionKey.EDIT_USER,
            PermissionKey.DELETE_USER,
          ].includes(p.key),
        )
        .map((p) => p._id);

      await this.roleModel.insertMany([
        { name: 'ADMIN', isDefault: false, permissions: allPermIds },
        { name: 'OPERATOR', isDefault: false, permissions: operatorPerms },
        { name: 'VIEWER', isDefault: true, permissions: viewerPerms },
      ]);
    }
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().populate('permissions').exec();
  }

  async findById(id: string): Promise<Role | null> {
    return this.roleModel.findById(id).populate('permissions').exec();
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleModel.findOne({ name }).populate('permissions').exec();
  }

  async create(input: CreateRoleInput): Promise<Role> {
    return this.roleModel.create({
      name: input.name,
      isDefault: input.isDefault ?? false,
      permissions: input.permissionIds ?? [],
    });
  }

  async update(id: string, input: UpdateRoleInput): Promise<Role> {
    const update: any = {};
    if (input.name !== undefined) update.name = input.name;
    if (input.isDefault !== undefined) update.isDefault = input.isDefault;
    if (input.permissionIds !== undefined) update.permissions = input.permissionIds;
    const role = await this.roleModel.findByIdAndUpdate(id, update, { new: true }).populate('permissions').exec();
    if (!role) throw new Error('Role not found');
    return role;
  }

  async delete(id: string): Promise<Role> {
    const role = await this.roleModel.findByIdAndDelete(id).exec();
    if (!role) throw new Error('Role not found');
    return role;
  }

  async getDefaultRole(): Promise<Role | null> {
    return this.roleModel.findOne({ isDefault: true }).populate('permissions').exec();
  }
}
