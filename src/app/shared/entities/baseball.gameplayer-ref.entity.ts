import { MonikerRef } from './moniker-ref.entity';
import { DocumentRef } from './document-ref.entity';
import { PlayerRef } from './player-ref.entity';

export class BaseballGamePlayerRef extends DocumentRef {
  player: PlayerRef;
  position: MonikerRef;
}
