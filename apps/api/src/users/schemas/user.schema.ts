import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  VIEWER = 'VIEWER',
}

registerEnumType(UserRole, { name: 'UserRole' });

@Schema({ timestamps: true })
@ObjectType()
export class User extends Document {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true, unique: true })
  @Field()
  email: string;

  @Prop()
  password?: string;

  @Prop()
  googleId?: string;

  @Prop({ default: UserRole.OPERATOR })
  @Field(() => UserRole)
  role: UserRole;

  @Prop({ default: true })
  @Field()
  active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
