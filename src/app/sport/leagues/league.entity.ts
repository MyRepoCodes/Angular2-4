import { Entity } from '../../shared/entities/entity';
import { MonikerRef } from '../../shared/entities/moniker-ref.entity';

export class League extends Entity {
  name: string;
  sport: MonikerRef;
}
