import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  userId: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  role: string;

  @Field(() => [String])
  permissions: string[];

  @Field()
  approved: boolean;
}
