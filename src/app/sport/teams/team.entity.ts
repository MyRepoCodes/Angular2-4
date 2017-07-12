import { Entity } from '../../shared/entities/entity';
import { MonikerRef } from '../../shared/entities/moniker-ref.entity';
import { DocumentRef } from '../../shared/entities/document-ref.entity';
import { DivisionRef } from '../../shared/entities/division-ref.entity';

export class Team extends Entity {
  name: string;
  abbreviation: string;
  division: DivisionRef;
  customer: boolean;
  fullName: string;
  league: MonikerRef;
  sport: DocumentRef;
  timeZone: string;
}
