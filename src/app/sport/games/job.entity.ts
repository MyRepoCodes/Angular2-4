import { Entity } from '../../shared/entities/entity';
import { DocumentRef } from '../../shared/entities/document-ref.entity';
import DateTimeFormat = Intl.DateTimeFormat;
import { UserRef } from '../../auth/user.models';
import { DateTimeUtils } from '../../shared/utils/datetime-utils';
import * as moment from 'moment';

export class Job extends Entity {
  server: DocumentRef;
  game: DocumentRef;
  jobArgs: string;
  status: JobStatus;
  created: DateTimeFormat;
  minStartDate: DateTimeFormat;
  jobHandler: DocumentRef;
  handlerType: JobHandlerType;
  comments: string[];
  assignee: UserRef;
  jobType: JobType;
  statusUpdates: { newStatus: string, updated: Date }[];

  public static createJobFromScratch(type, serverId, gameId, gameIid) {
    return {
      server: <DocumentRef>{ id: serverId, iid: 0 },
      game: <DocumentRef>{ id: gameId, iid: gameIid },
      jobArgs: '',
      status: JobStatus.New,
      created: moment.utc().format(),
      minStartDate: moment.utc().format(),
      jobHandler: null,
      handlerType: JobHandlerType.Unknown,
      comments: [''],
      assignee: <UserRef>{},
      jobType: type
    };
  }

  public static getJobNameByType(jobType: any) {
    if (JobType.Unknown === jobType) {
      return JobType[JobType.Unknown];
    }
    if (JobType.RosterUpdate === jobType) {
      return JobType[JobType.RosterUpdate];
    }
    if (JobType.MoveHyperAsset === jobType) {
      return JobType[JobType.MoveHyperAsset];
    }
    if (JobType.CreateMission === jobType) {
      return JobType[JobType.CreateMission];
    }
    if (JobType.ActivateMission === jobType) {
      return JobType[JobType.ActivateMission];
    }
    if (JobType.Phase1Logging === jobType) {
      return JobType[JobType.Phase1Logging];
    }
    if (JobType.Phase2Logging === jobType) {
      return JobType[JobType.Phase2Logging];
    }
    if (JobType.Phase3Logging === jobType) {
      return JobType[JobType.Phase3Logging];
    }
    if (JobType.ExportEvents === jobType) {
      return JobType[JobType.ExportEvents];
    }
    if (JobType.IngestEvents === jobType) {
      return JobType[JobType.IngestEvents];
    }
    if (JobType.SendToQA === jobType) {
      return JobType[JobType.SendToQA];
    }
    if (JobType.Encoding === jobType) {
      return JobType[JobType.Encoding];
    }
    return JobType[JobType.Unknown];
  }

  public static getJobStatusNameByStatus(status, jobType = undefined) {
    if (JobStatus.Unknown === status) {
      return JobStatus[JobStatus.Unknown];
    }
    if (JobStatus.New === status) {
      return JobStatus[JobStatus.New];
    }
    if (JobStatus.Claimed === status) {
      return JobStatus[JobStatus.Claimed];
    }
    if (JobStatus.Running === status && Job.isLoggingPhase(jobType)) {
      return 'In Progress';
    } else if (JobStatus.Running === status) {
      return JobStatus[JobStatus.Running];
    }
    if (JobStatus.RetryPending === status) {
      return JobStatus[JobStatus.RetryPending];
    }
    if (JobStatus.Cancelled === status) {
      return JobStatus[JobStatus.Cancelled];
    }
    if (JobStatus.Failed === status) {
      return JobStatus[JobStatus.Failed];
    }
    if (JobStatus.Completed === status) {
      return JobStatus[JobStatus.Completed];
    }
    if (JobStatus.Ready === status) {
      return JobStatus[JobStatus.Ready];
    }
    return JobStatus[JobStatus.Unknown];
  }

  public static getCorrectAssigneeName(assignee) {
    if (!assignee) {
      return 'Unassigned';
    }
    let name = '';
    if (assignee.first) {
      name += assignee.first + ' ';
    }
    if (assignee.last) {
      name += assignee.last;
    }
    if (name === '' && assignee.username && assignee.username !== '') {
      name = assignee.username;
    }
    return name !== '' ? name : 'Unassigned';
  }

  static isLoggingPhase(jobType) {
    return jobType === 5 || jobType === 6 || jobType === 7;
  }
}

export enum JobStatus {
  Unknown = 0,
  New,
  Claimed,
  Running,
  RetryPending,
  Cancelled,
  Failed,
  Completed,
  Ready
}

export enum JobHandlerType {
  Unknown = 0,
  DvdEncoding,
  TvEncoding
}

export enum JobType {
  Unknown = 0,
  RosterUpdate,
  MoveHyperAsset,
  CreateMission,
  ActivateMission,
  Phase1Logging,
  Phase2Logging,
  Phase3Logging,
  ExportEvents,
  IngestEvents,
  SendToQA,
  Encoding
}
