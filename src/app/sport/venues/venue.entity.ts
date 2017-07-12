import { Entity } from '../../shared/entities/entity';
import { DocumentRef } from '../../shared/entities/document-ref.entity';

export class Venue extends Entity {
  name: string;
  sport: DocumentRef;
}
