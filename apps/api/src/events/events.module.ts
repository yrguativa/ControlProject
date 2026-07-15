import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './schemas/event.schema';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])],
  providers: [EventsService, EventsResolver],
  exports: [EventsService],
})
export class EventsModule {}
