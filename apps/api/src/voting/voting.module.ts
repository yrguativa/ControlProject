import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vote, VoteSchema } from './schemas/vote.schema';
import { VotingService } from './voting.service';
import { VotingResolver } from './voting.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Vote.name, schema: VoteSchema }])],
  providers: [VotingService, VotingResolver],
  exports: [VotingService],
})
export class VotingModule {}
