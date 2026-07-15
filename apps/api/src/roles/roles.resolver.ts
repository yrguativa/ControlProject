import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Role } from './schemas/role.schema';
import { RolesService } from './roles.service';
import { CreateRoleInput, UpdateRoleInput } from './dto/role.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

const ADMIN = 'ADMIN';

@Resolver(() => Role)
export class RolesResolver {
  constructor(private rolesService: RolesService) {}

  @Query(() => [Role])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ADMIN)
  roles(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Query(() => Role, { nullable: true })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ADMIN)
  role(@Args('id') id: string): Promise<Role | null> {
    return this.rolesService.findById(id);
  }

  @Mutation(() => Role)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ADMIN)
  createRole(@Args('input') input: CreateRoleInput): Promise<Role> {
    return this.rolesService.create(input);
  }

  @Mutation(() => Role)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ADMIN)
  updateRole(
    @Args('id') id: string,
    @Args('input') input: UpdateRoleInput,
  ): Promise<Role> {
    return this.rolesService.update(id, input);
  }

  @Mutation(() => Role)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ADMIN)
  deleteRole(@Args('id') id: string): Promise<Role> {
    return this.rolesService.delete(id);
  }
}
