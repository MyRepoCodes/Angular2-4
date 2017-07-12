import { Entity } from '../../shared/entities/entity';
import { MonikerRef } from '../../shared/entities/moniker-ref.entity';
import { DocumentRef } from '../../shared/entities/document-ref.entity';

export class Season extends Entity {
  name: string;
  description: string;
  league: MonikerRef;
  sport: DocumentRef;
}
