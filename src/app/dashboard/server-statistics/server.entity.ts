import { Entity } from '../../shared/entities/entity';
import { BasicMonikerRef } from '../../shared/entities/basic-moniker-ref.entity';

export class Server extends Entity {
  name: string;
  tvEncoding: number;
  gameUploading: number;
  uploadComplete: number;
  readyToEncode: number;
  dvdEncoding: number;
  readyToPoQa: number;
  readyToP1: number;
  p1InProgress: number;
  needsPbp: number;
  readyToP2: number;
  p2InProgress: number;
  triggers: number;
  games: BasicMonikerRef[];
}
