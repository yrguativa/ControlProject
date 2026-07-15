import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export enum VoteOption {
  SI = 'SI',
  NO = 'NO',
  ABSTENCION = 'ABSTENCION',
}

registerEnumType(VoteOption, { name: 'VoteOption' });

@Schema({ timestamps: true })
@ObjectType()
export class Vote extends Document {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop({ required: true })
  @Field()
  deviceId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
  @Field()
  eventId: string;

  @Prop({ required: true, enum: VoteOption })
  @Field(() => VoteOption)
  vote: VoteOption;

  @Prop({ default: Date.now })
  @Field()
  timestamp: Date;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
