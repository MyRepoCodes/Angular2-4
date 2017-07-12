import { Entity } from '../../shared/entities/entity';
import { MonikerRef } from '../../shared/entities/moniker-ref.entity';
import { DocumentRef } from '../../shared/entities/document-ref.entity';

export class Conference extends Entity {
  name: string;
  league: MonikerRef;
  sport: DocumentRef;
}
