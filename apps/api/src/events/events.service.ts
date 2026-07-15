import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schemas/event.schema';
import { CreateEventInput } from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async create(input: CreateEventInput, userId: string): Promise<Event> {
    return this.eventModel.create({ ...input, createdBy: userId });
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().sort({ startTime: -1 }).exec();
  }

  async findById(id: string): Promise<Event | null> {
    return this.eventModel.findById(id).exec();
  }

  async activate(id: string): Promise<Event> {
    return (await this.eventModel.findByIdAndUpdate(id, { active: true }, { new: true }).exec())!;
  }

  async deactivate(id: string): Promise<Event> {
    return (await this.eventModel.findByIdAndUpdate(id, { active: false }, { new: true }).exec())!;
  }

  async end(id: string): Promise<Event> {
    return (await this.eventModel.findByIdAndUpdate(
      id,
      { active: false, endTime: new Date() },
      { new: true },
    ).exec())!;
  }
}
