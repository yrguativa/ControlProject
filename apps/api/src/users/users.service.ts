import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import { Role } from '../roles/schemas/role.schema';
import { CreateUserInput } from './dto/user.dto';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private rolesService: RolesService,
  ) {}

  async create(input: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(input.password, 12);
    let roleId = input.roleId;

    if (!roleId) {
      const defaultRole = await this.rolesService.getDefaultRole();
      if (defaultRole) roleId = defaultRole._id.toString();
    }

    return this.userModel.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: roleId,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).populate({ path: 'role', populate: { path: 'permissions' } }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).populate({ path: 'role', populate: { path: 'permissions' } }).exec();
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userModel.findOne({ googleId }).populate('role').exec();
  }

  async createGoogleUser(data: {
    googleId: string;
    email: string;
    name: string;
  }): Promise<User> {
    const defaultRole = await this.rolesService.getDefaultRole();
    return this.userModel.create({
      ...data,
      role: defaultRole?._id,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('role').exec();
  }

  async updateRole(id: string, roleId: string): Promise<User> {
    return (await this.userModel.findByIdAndUpdate(id, { role: roleId }, { new: true }).populate('role').exec())!;
  }

  async approve(id: string): Promise<User> {
    return (await this.userModel.findByIdAndUpdate(id, { approved: true, active: true }, { new: true }).populate('role').exec())!;
  }

  async toggleActive(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    user.active = !user.active;
    return (await user.save()).populate('role');
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).populate({ path: 'role', populate: { path: 'permissions' } }).exec();
    if (!user || !user.password) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
}
