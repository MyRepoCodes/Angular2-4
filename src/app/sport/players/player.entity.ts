import { Entity } from '../../shared/entities/entity';
import { DocumentRef } from '../../shared/entities/document-ref.entity';

export class Player extends Entity {
  name: string;
  birthDate: Date;
  birthPlace: string;
  college: string;
  debut: Date;
  firstName: string;
  height: number;
  lastName: string;
  sport: DocumentRef;
  status: string;
  weight: number;
}
