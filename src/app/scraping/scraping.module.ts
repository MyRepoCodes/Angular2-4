import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RulesComponent } from './rules/rules.component';
import { SharedModule } from '../shared/shared.module';
import { ScrapingHttpService } from './scraping.http.service';
import { RuleEditorComponent } from './rules/rule-editor.component';
import { PlayerRuleComponent } from './rules/player-rule.component';

import {
  DataTableModule, DropdownModule, SharedModule as PrimeNgSharedModule, ButtonModule,
  DialogModule, InputTextModule, CheckboxModule, SpinnerModule, CalendarModule, MultiSelectModule,
  ConfirmDialogModule, SelectButtonModule
} from 'primeng/primeng';
import { RuleTextPipe } from './rules/rule-text.pipe';
import { ConflictsComponent } from './conflicts/conflicts.component';
import { RouterModule } from '@angular/router';
import { ScrapingFilterComponent } from './scraping-filter.component';
import { ConflictsFilterComponent } from './conflicts/conflicts-filter.component';
import { GameRuleComponent } from './rules/game-rule.component';
import { ConflictDetailsComponent } from './conflicts/conflict-details.component';
import { ConflictInfoComponent } from './conflicts/conflict-info.component';
import { PlayerConflictResolverComponent } from './conflicts/player-conflict-resolver.component';
import { GameConflictResolverComponent } from './conflicts/game-conflict-resolver.component';
import { LineupConflictResolverComponent } from './conflicts/linup-conflict-resolver.component';
import { PropertySearchComponent } from './property-search.component';
import { BulkResyncComponent } from './conflicts/bulk-resync.component';
import { ConflictResolutionComponent } from './conflicts/conflict-resolution.component';
import { TeamRuleComponent } from './rules/team-rule.component';


export const scrapingRoutes = [
  { path: 'rules', component: RulesComponent },
  { path: 'conflicts', component: ConflictsComponent }
];




@NgModule({
  imports: [

    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,

    // PrimeNG
    DataTableModule, DropdownModule, PrimeNgSharedModule,
    ButtonModule, DialogModule, InputTextModule,
    CalendarModule, CheckboxModule, SpinnerModule,
    MultiSelectModule, ConfirmDialogModule, SelectButtonModule,

    // Webops
    SharedModule

  ],
  declarations: [
    RuleEditorComponent, PlayerRuleComponent,
    RulesComponent, RuleTextPipe, ConflictsComponent,
    ScrapingFilterComponent,
    ConflictsFilterComponent, GameRuleComponent,
    ConflictDetailsComponent,
    ConflictInfoComponent, PlayerConflictResolverComponent,
    GameConflictResolverComponent, LineupConflictResolverComponent, PropertySearchComponent, BulkResyncComponent,
    ConflictResolutionComponent, TeamRuleComponent
  ],
  providers: [
    ScrapingHttpService
  ]
})
export class ScrapingModule {}
