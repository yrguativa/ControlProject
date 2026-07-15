import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/user.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

const ADMIN = 'ADMIN';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ADMIN)
  users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    const found = await this.usersService.findById(user._id.toString());
    if (!found) throw new NotFoundException('User not found');
    return found;
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ADMIN)
  createUser(
    @Args('input') input: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(input);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ADMIN)
  updateUserRole(
    @Args('id') id: string,
    @Args('roleId') roleId: string,
  ): Promise<User> {
    return this.usersService.updateRole(id, roleId);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ADMIN)
  approveUser(
    @Args('id') id: string,
  ): Promise<User> {
    return this.usersService.approve(id);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ADMIN)
  async toggleUserActive(
    @CurrentUser() currentUser: User,
    @Args('id') id: string,
  ): Promise<User> {
    if (currentUser._id.toString() === id) {
      throw new ForbiddenException('No puedes desactivar tu propia cuenta');
    }
    return this.usersService.toggleActive(id);
  }
}
