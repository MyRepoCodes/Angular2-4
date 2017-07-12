import { Entity } from '../../shared/entities/entity';
import { UserRef } from '../../auth/user.models';


export class LoggerMapping extends Entity {
  // db fields
  desiId: string;
  trainingInfo: TrainingInfo;
  logger: UserRef;

  // service fields
  name: string;
  isNew: boolean;

  constructor(item?: any) {
    super();
    if (item) {
      this.id = item.id;
      this.logger = item.logger;
      this.desiId = item.desiId;
      this.trainingInfo = new TrainingInfo(item.trainingInfo) || new TrainingInfo();

      this.isNew = item.isNew;
    }
  }
}

export class TrainingInfo {
  desiId: string;
  virtualMachine: string;
  course: number;
  phase: number;
  startDate: Date;
  endDate: Date;
  active: boolean;

  constructor(obj?: any) {
    if (obj) {
      this.desiId = obj.desiId;
      this.virtualMachine = obj.virtualMachine;
      this.course = obj.course;
      this.phase = obj.phase;
      this.startDate = obj.startDate ? new Date(obj.startDate) : null;
      this.endDate = obj.endDate ? new Date(obj.endDate) : null;
      this.active = obj.active;
    }
  }
}
