import { Component, Input } from '@angular/core';

@Component({
  selector: 'sn-lineup-conflict-resolver',
  templateUrl: 'lineup-conflict-resolver.component.html'
})
export class LineupConflictResolverComponent {
  @Input() conflict;

  @Input() set resolution(item) {
    if (item) {
      this.playerSuggestions = item.candidates.map(c => c.object.player).filter(x => x !== undefined);
      this.gameSuggestions = item.candidates.map(c => c.object.game).filter(x => x !== undefined);
    }
  }

  playerSuggestions;
  gameSuggestions;

  constructor() {
  }

}
