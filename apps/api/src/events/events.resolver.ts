import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, NotFoundException } from '@nestjs/common';
import { Event } from './schemas/event.schema';
import { EventsService } from './events.service';
import { CreateEventInput } from './dto/event.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Event)
export class EventsResolver {
  constructor(private eventsService: EventsService) {}

  @Query(() => [Event])
  events(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Query(() => Event)
  async event(@Args('id') id: string): Promise<Event> {
    const event = await this.eventsService.findById(id);
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  @Mutation(() => Event)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  createEvent(
    @Args('input') input: CreateEventInput,
    @CurrentUser('_id') userId: string,
  ): Promise<Event> {
    return this.eventsService.create(input, userId);
  }

  @Mutation(() => Event)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  activateEvent(@Args('id') id: string): Promise<Event> {
    return this.eventsService.activate(id);
  }

  @Mutation(() => Event)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  endEvent(@Args('id') id: string): Promise<Event> {
    return this.eventsService.end(id);
  }
}
