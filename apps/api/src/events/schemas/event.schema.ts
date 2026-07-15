import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
@ObjectType()
export class Event extends Document {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true })
  @Field()
  location: string;

  @Prop()
  @Field({ nullable: true })
  description?: string;

  @Prop({ required: true })
  @Field()
  startTime: Date;

  @Prop()
  @Field({ nullable: true })
  endTime?: Date;

  @Prop({ default: false })
  @Field()
  active: boolean;

  @Prop({ default: 0 })
  @Field()
  totalCoeficiente: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  @Field()
  createdBy: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
