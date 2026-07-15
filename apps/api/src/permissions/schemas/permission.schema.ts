import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum PermissionKey {
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',
  VIEW_EVENTS = 'VIEW_EVENTS',
  CREATE_EVENT = 'CREATE_EVENT',
  EDIT_EVENT = 'EDIT_EVENT',
  DELETE_EVENT = 'DELETE_EVENT',
  VIEW_DEVICES = 'VIEW_DEVICES',
  CREATE_DEVICE = 'CREATE_DEVICE',
  EDIT_DEVICE = 'EDIT_DEVICE',
  DELETE_DEVICE = 'DELETE_DEVICE',
  VIEW_USERS = 'VIEW_USERS',
  CREATE_USER = 'CREATE_USER',
  EDIT_USER = 'EDIT_USER',
  DELETE_USER = 'DELETE_USER',
  MANAGE_ROLES = 'MANAGE_ROLES',
  VIEW_VOTING = 'VIEW_VOTING',
  CAST_VOTE = 'CAST_VOTE',
}

registerEnumType(PermissionKey, { name: 'PermissionKey' });

@Schema({ timestamps: true })
@ObjectType()
export class Permission extends Document {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true, enum: PermissionKey })
  @Field(() => PermissionKey)
  key: PermissionKey;

  @Prop({ required: true })
  @Field()
  label: string;

  @Prop()
  @Field({ nullable: true })
  description?: string;

  @Prop({ required: true })
  @Field()
  group: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
