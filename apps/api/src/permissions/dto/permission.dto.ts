import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { PermissionKey } from '../schemas/permission.schema';

@InputType()
export class CreatePermissionInput {
  @Field(() => PermissionKey)
  @IsEnum(PermissionKey)
  key: PermissionKey;

  @Field()
  @IsNotEmpty()
  label: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field()
  @IsNotEmpty()
  group: string;
}
