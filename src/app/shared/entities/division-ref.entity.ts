import { MonikerRef } from './moniker-ref.entity';
import { ConferenceRef } from './conference-ref.entity';

export class DivisionRef extends MonikerRef {
  conference: ConferenceRef;
}
