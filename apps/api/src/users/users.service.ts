import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './schemas/user.schema';
import { CreateUserInput } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(input: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(input.password, 12);
    return this.userModel.create({
      ...input,
      password: hashedPassword,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userModel.findOne({ googleId }).exec();
  }

  async createGoogleUser(data: {
    googleId: string;
    email: string;
    name: string;
  }): Promise<User> {
    return this.userModel.create({
      ...data,
      role: UserRole.OPERATOR,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    return (await this.userModel.findByIdAndUpdate(id, { role }, { new: true }).exec())!;
  }

  async toggleActive(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    user.active = !user.active;
    return user.save();
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user || !user.password) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
}
