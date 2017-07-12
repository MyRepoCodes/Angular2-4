import { MonikerRef } from './moniker-ref.entity';
import { BasicMonikerRef } from './basic-moniker-ref.entity';
import { Game } from '../../sport/games/game.entity';
import { DocumentRef } from './document-ref.entity';

export class GameRef extends DocumentRef {
  awayTeam: MonikerRef;
  homeTeam: MonikerRef;
  competition: BasicMonikerRef;
  league: MonikerRef;
  season: BasicMonikerRef;
  date: Date;

  constructor(game: Game) {
    super();
    this.id = game.id;
    this.iid = game.iid;
    this.awayTeam = game.awayTeam;
    this.homeTeam = game.homeTeam;
    this.competition = game.competition;
    this.league = game.league;
    this.season = game.season;
    this.date = game.date;
  }
}
