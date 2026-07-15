import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vote, VoteOption } from './schemas/vote.schema';
import { EventResults, VoteResult } from './dto/vote.dto';

@Injectable()
export class VotingService {
  constructor(@InjectModel(Vote.name) private voteModel: Model<Vote>) {}

  async castVote(deviceId: string, eventId: string, vote: VoteOption): Promise<Vote> {
    const existing = await this.voteModel.findOne({ deviceId, eventId }).exec();
    if (existing) {
      throw new BadRequestException('Device already voted for this event');
    }

    return this.voteModel.create({ deviceId, eventId, vote });
  }

  async getEventResults(eventId: string): Promise<EventResults> {
    const votes = await this.voteModel.find({ eventId }).exec();

    const results: Record<string, number> = {
      [VoteOption.SI]: 0,
      [VoteOption.NO]: 0,
      [VoteOption.ABSTENCION]: 0,
    };

    votes.forEach((v) => {
      results[v.vote]++;
    });

    const total = votes.length;

    const voteResults: VoteResult[] = Object.entries(results).map(([option, count]) => ({
      option: option as VoteOption,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      coeficiente: 0,
    }));

    return {
      eventId,
      totalVoters: total,
      totalVotes: total,
      quorum: total,
      results: voteResults,
    };
  }

  async getVotes(eventId: string): Promise<Vote[]> {
    return this.voteModel.find({ eventId }).sort({ timestamp: -1 }).exec();
  }
}
