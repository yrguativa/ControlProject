import { ObjectType, Field } from '@nestjs/graphql';
import { VoteOption } from '../schemas/vote.schema';

@ObjectType()
export class VoteResult {
  @Field(() => VoteOption)
  option: VoteOption;

  @Field()
  count: number;

  @Field()
  percentage: number;

  @Field()
  coeficiente: number;
}

@ObjectType()
export class EventResults {
  @Field()
  eventId: string;

  @Field()
  totalVoters: number;

  @Field()
  totalVotes: number;

  @Field()
  quorum: number;

  @Field(() => [VoteResult])
  results: VoteResult[];
}
