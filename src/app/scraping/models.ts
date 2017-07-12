export interface ResolutionRuleset {
  id: string;
  entity: string;
  leagueIid: number;
  sport: number;
  scraperUrl: string;
  matchRules: any;
  resolutionRules: any;
  resolutionWeight: number;
  enabled: boolean;
}


export interface PlayerConflict {
  id: string;
  scraperId: string;
  scraperUrl: string;
  sportIid: number;
  leagueIid: number;
  status: string;
  data: ScrapedPlayer;
  conflictMetadata: SynergyPlayer[];
}


export interface ScrapedPlayer {
  firstname: string;
  lastname: string;
  birthDate: any;
  heightInches: number;
  weightPounds: number;
  throwingArm: string;
  battingArm: string;
  currentTeam: string;
}

export interface SynergyPlayer {
  id: string;
  iid: number;
  name: string;
  birthDate: Date;
  birthPlace: string;
  college: string;
  debut: Date;
  firstName: string;
  height: number;
  lastName: string;
  status: string;
  weight: number;
  bats: string;
  throws: string;
}

export interface FieldSearchDefinition {
  label: string;
  field: string;
  value: string;
  op: string;
  type: string;
}
