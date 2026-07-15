import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Device } from './schemas/device.schema';
import { DevicesService } from './devices.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

const ADMIN = 'ADMIN';
const OPERATOR = 'OPERATOR';

@Resolver(() => Device)
export class DevicesResolver {
  constructor(private devicesService: DevicesService) {}

  @Query(() => [Device])
  @UseGuards(GqlAuthGuard)
  devices(): Promise<Device[]> {
    return this.devicesService.findAll();
  }

  @Mutation(() => Device)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ADMIN, OPERATOR)
  registerDevice(
    @Args('macAddress') macAddress: string,
    @Args('label', { nullable: true }) label?: string,
  ): Promise<Device> {
    return this.devicesService.register(macAddress, label);
  }

  @Mutation(() => Device)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ADMIN, OPERATOR)
  assignDevice(
    @Args('deviceId') deviceId: string,
    @Args('eventId') eventId: string,
  ): Promise<Device> {
    return this.devicesService.assignToEvent(deviceId, eventId);
  }

  @Mutation(() => Device)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ADMIN)
  deactivateDevice(@Args('id') id: string): Promise<Device> {
    return this.devicesService.deactivate(id);
  }
}
