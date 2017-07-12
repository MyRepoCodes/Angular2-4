import { Entity } from '../../shared/entities/entity';
import { MonikerRef } from '../../shared/entities/moniker-ref.entity';

export class Competition extends Entity {
  name: string;
  league: MonikerRef;
  sport: MonikerRef;
}
