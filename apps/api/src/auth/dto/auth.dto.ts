import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ObjectType as GqlObjType } from '@nestjs/graphql';

@GqlObjType()
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
}
