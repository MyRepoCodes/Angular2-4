import { Component, Input } from '@angular/core';
import { ScrapingUtils } from '../scraping.utils';

@Component({
  selector: 'sn-player-conflict-resolver',
  templateUrl: 'player-conflict-resolver.component.html',
  styles: [` .label { font-weight: bold}`]
})
export class PlayerConflictResolverComponent {

  @Input() conflict;
  @Input() suggestions;


  selectedSuggestion;
  rule;
  creatingRule = false;
  ruleCreated = false;

  constructor() {
  }

  createRule() {
    this.rule = ScrapingUtils.createRulesetFromPlayerConflict(this.conflict, { player: this.selectedSuggestion });
    this.creatingRule = true;
  }

  createIidHintRule() {
    this.rule = ScrapingUtils.createRulesetFromPlayerConflict(this.conflict, { iidHint: this.selectedSuggestion.iid });
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
