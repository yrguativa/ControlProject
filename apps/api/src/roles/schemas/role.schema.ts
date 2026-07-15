import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Permission } from '../../permissions/schemas/permission.schema';

@Schema({ timestamps: true })
@ObjectType()
export class Role extends Document {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  @Field()
  name: string;

  @Prop({ default: false })
  @Field()
  isDefault: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Permission' }], default: [] })
  @Field(() => [Permission])
  permissions: (Types.ObjectId | Permission)[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
