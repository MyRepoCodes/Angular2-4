import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {
  DataTableModule, DropdownModule, ButtonModule, DialogModule, InputTextModule, CalendarModule, CheckboxModule,
  SpinnerModule, MultiSelectModule, ConfirmDialogModule, SelectButtonModule, ToggleButtonModule, PanelModule
} from 'primeng/primeng';
import { GameTrackerListComponent } from './game-tracker-list.component';
import { FilterComponent } from './filter.component';
import { GameStatusComponent } from './game-status.component';
import { GameTrackerRouterComponent } from './game-tracker.component';
import { GameTrackerService } from './game-tracker.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,

    // Angular
    CommonModule, FormsModule, ReactiveFormsModule, HttpModule, RouterModule,

    // PrimeNG
    DataTableModule, DropdownModule, ButtonModule, DialogModule, InputTextModule, CalendarModule, CheckboxModule,
    SpinnerModule, MultiSelectModule, ConfirmDialogModule, SelectButtonModule, ToggleButtonModule, PanelModule
  ],
  declarations: [
    GameTrackerListComponent, FilterComponent, GameStatusComponent, GameTrackerRouterComponent
  ],
  providers: [
    GameTrackerService
  ]
})
export class GameTrackerModule {
}
