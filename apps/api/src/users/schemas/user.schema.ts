import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from '../../roles/schemas/role.schema';

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

  @Prop({ type: Types.ObjectId, ref: 'Role', required: false })
  @Field(() => Role, { nullable: true })
  role: Types.ObjectId | Role;

  @Prop({ default: false })
  @Field()
  active: boolean;

  @Prop({ default: false })
  @Field()
  approved: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
