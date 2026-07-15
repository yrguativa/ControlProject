import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device } from './schemas/device.schema';

@Injectable()
export class DevicesService {
  constructor(@InjectModel(Device.name) private deviceModel: Model<Device>) {}

  async register(macAddress: string, label?: string): Promise<Device> {
    return this.deviceModel.create({ macAddress, label });
  }

  async findAll(): Promise<Device[]> {
    return this.deviceModel.find().exec();
  }

  async findById(id: string): Promise<Device | null> {
    return this.deviceModel.findById(id).exec();
  }

  async assignToEvent(id: string, eventId: string): Promise<Device> {
    return (await this.deviceModel.findByIdAndUpdate(
      id,
      { assignedEvent: eventId },
      { new: true },
    ).exec())!;
  }

  async deactivate(id: string): Promise<Device> {
    return (await this.deviceModel.findByIdAndUpdate(id, { active: false }, { new: true }).exec())!;
  }

  async bulkAssign(eventId: string, deviceIds: string[]): Promise<Device[]> {
    return this.deviceModel.updateMany(
      { _id: { $in: deviceIds } },
      { assignedEvent: eventId },
    ).exec().then(() => this.deviceModel.find({ assignedEvent: eventId }).exec());
  }
}
