import { Entity } from '../../shared/entities/entity';
import { MonikerRef } from '../../shared/entities/moniker-ref.entity';
import { DocumentRef } from '../../shared/entities/document-ref.entity';
import { BasicMonikerRef } from '../../shared/entities/basic-moniker-ref.entity';
import { Job, JobStatus } from './job.entity';

export class Game extends Entity {
  awayTeam: MonikerRef;
  awayScore: number;
  competition: BasicMonikerRef;
  homeTeam: MonikerRef;
  homeScore: number;
  date: Date;
  utc: Date;
  league: MonikerRef;
  name: string;
  season: BasicMonikerRef;
  sport: DocumentRef;
  timeZone: string;
  venue: BasicMonikerRef;
  jobs: Job[];
  overallJobsStatus: string;
  jobType: string;
  jobStatus: string;
  gameOwnerType: number;
  index: number;
  gamePlayersHome: GamePlayerRef[];
  gamePlayersAway: GamePlayerRef[];
  status: GameStatus;
  priority: number;
  dueDate: Date;
  encodingServer: BasicMonikerRef;
  missionId: string;
  missionStatus: string;
  assetIds: string[];

  public static getGameJobsOverallStatus(jobs) {
    if (!(jobs)) {
      return 'Not Setup';
    }
    if (jobs.length === 0) { return 'Not Setup'; }
    if (jobs.length > 0 && jobs.length < 10) { return 'Partially Setup'; }

    const failed = jobs.filter(j => j.status === JobStatus.Failed);
    if (failed && failed.length >= 1) { return 'Failed'; }

    const completed = jobs.filter(j => j.status === JobStatus.Completed);
    if (completed && completed.length === 10) { return 'Completed'; }

    const notStarted = jobs.filter(j => j.status === JobStatus.New);
    if (notStarted && notStarted.length === 10) { return 'Not Started'; }

    return 'In Progress';
  }
}

export interface ILogger {
  name: string;
  clips: string;
}

export enum GameStatus {
  none,
  unknown,
  completedEarly,
  final,
  inProgress,
  postponed,
  preGame,
  preview,
  warmup,
  cancelled,
  gameOver,
  delayedStart,
  delayed
}

export class GamePlayerRef extends DocumentRef {
  isHome: boolean;
}
