import { InputType, Field } from '@nestjs/graphql';
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateEventInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  location: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field()
  @IsDateString()
  startTime: string;

  @Field()
  totalCoeficiente: number;
}
