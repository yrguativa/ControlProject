import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Permission } from './schemas/permission.schema';
import { PermissionsService } from './permissions.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

const ADMIN = 'ADMIN';

@Resolver(() => Permission)
export class PermissionsResolver {
  constructor(private permissionsService: PermissionsService) {}

  @Query(() => [Permission])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ADMIN)
  permissions(): Promise<Permission[]> {
    return this.permissionsService.findAll();
  }
}
