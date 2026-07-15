import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';

@InputType()
export class CreateRoleInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  isDefault?: boolean;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  permissionIds?: string[];
}

@InputType()
export class UpdateRoleInput {
  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  isDefault?: boolean;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  permissionIds?: string[];
}
