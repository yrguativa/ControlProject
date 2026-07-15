import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Vote, VoteOption } from './schemas/vote.schema';
import { VotingService } from './voting.service';
import { EventResults } from './dto/vote.dto';

@Resolver(() => Vote)
export class VotingResolver {
  constructor(private votingService: VotingService) {}

  @Query(() => EventResults)
  eventResults(@Args('eventId') eventId: string): Promise<EventResults> {
    return this.votingService.getEventResults(eventId);
  }

  @Query(() => [Vote])
  votes(@Args('eventId') eventId: string): Promise<Vote[]> {
    return this.votingService.getVotes(eventId);
  }

  @Mutation(() => Vote)
  castVote(
    @Args('deviceId') deviceId: string,
    @Args('eventId') eventId: string,
    @Args('vote', { type: () => VoteOption }) vote: VoteOption,
  ): Promise<Vote> {
    return this.votingService.castVote(deviceId, eventId, vote);
  }
}
