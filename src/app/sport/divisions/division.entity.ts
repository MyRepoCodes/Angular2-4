import { Entity } from '../../shared/entities/entity';
import { ConferenceRef } from '../../shared/entities/conference-ref.entity';
import { MonikerRef } from '../../shared/entities/moniker-ref.entity';

export class Division extends Entity {
  name: string;
  abbreviation: string;
  conference: ConferenceRef;
  sport: MonikerRef;
}
