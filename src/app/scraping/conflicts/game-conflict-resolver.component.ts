import { Component, Input } from '@angular/core';
import { ScrapingUtils } from '../scraping.utils';

@Component({
    selector: 'sn-game-conflict-resolver',
    templateUrl: 'game-conflict-resolver.component.html'
})
export class GameConflictResolverComponent {

  @Input() conflict;
  @Input() suggestions;

  selectedSuggestion;
  rule;
  creatingRule = false;
  ruleCreated = false;


  constructor(
  ) {
  }

  createRule() {
    this.rule = ScrapingUtils.createGameRuleFromGameConflict(this.conflict, this.selectedSuggestion);
    this.creatingRule = true;
  }

  createIidHintRule() {
    this.rule = ScrapingUtils.createGameRuleFromGameConflict(this.conflict, this.selectedSuggestion, this.selectedSuggestion.iid);
    this.creatingRule = true;
  }

  onRuleSaved() {
    this.creatingRule = false;
    this.ruleCreated = true;
  }

  back() {
    this.creatingRule = false;
  }

}
