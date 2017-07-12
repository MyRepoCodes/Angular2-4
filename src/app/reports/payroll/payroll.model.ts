export class Payroll {

  public period: any;
  public game: any;
  public phase: number;
  public logger: any;
  public rateInfo: any;
  public loggingDate: any; // ?????
  public clips;
  public totalClips;
  public gameClips;
  public clipsPercent;
  public amount;
  public adjust;
  public notes;
  public payrollNotes;
  public manualEntry: boolean;
  public totalMinutesWorked;
  public loggingCompleted;
  public amountCalculationStatus;
  public loggingStats: any;

  public relatedRecords: Payroll[];


  constructor(data: any) {
    this.period = data.period;
    this.game = data.game;
    this.phase = data.phase;
    this.logger = data.logger;
    this.rateInfo = data.rateInfo;
    this.loggingDate = data.loggingDate;
    this.clips = data.clips;
    this.totalClips = data.totalClips;
    this.gameClips = data.gameClips;
    this.clipsPercent = data.clipsPercent;
    this.amount = data.amount;
    this.adjust = data.adjust;
    this.notes = data.notes;
    this.payrollNotes = data.payrollNotes;
    this.manualEntry = data.manualEntry;
    this.totalMinutesWorked = data.totalMinutesWorked;
    this.loggingCompleted = data.loggingCompleted;
    this.amountCalculationStatus = data.amountCalculationStatus;
    this.relatedRecords = data.relatedRecords;
  }
}

export enum AdjustmentType {
  NoAdjustment,
  IncompleteGame,
  TechIssues,
  LiveGamePay
}

export enum RecordType {
  RegularPay,
  TrainingPay,
  LoggingBonus,
  NoGameOnShift,
  GlobalIssue
}
