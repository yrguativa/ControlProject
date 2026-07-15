import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
@ObjectType()
export class Device extends Document {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  @Field()
  macAddress: string;

  @Prop()
  @Field({ nullable: true })
  label?: string;

  @Prop({ default: true })
  @Field()
  active: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event' })
  @Field({ nullable: true })
  assignedEvent?: string;

  @Prop({ default: 0 })
  @Field()
  batteryLevel: number;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
