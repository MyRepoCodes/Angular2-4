import { NgModule } from '@angular/core';
import { EncodingStartStopControlsComponent } from './components/encoding.start-stop-controls.component';
import { EncodingPlayerComponent } from './components/encoding-player.component';
import { EncodingControlsComponent } from './components/encoding-controls.component';
import { EncodingPlayerRouteComponent } from './routes/EncodingPlayerRoute';
import { EncodingRouterComponent } from './routes/encoding.route';
import { EncodingPlayerContainerComponent } from './containers/encoding-player.container';
import { EncodingRecordingsComponent } from './containers/recordings.container';
import { EncodingScheduleComponent } from './containers/encoding-schedule.container';
import { EncodingScheduleDialogComponent } from './components/encoding-schedule-dialog.component';
import { AvermediaControlsComponent } from './components/encoding-avermedia.component';
import { EncodingStreamSelectorComponent } from './components/encoding-stream-selector.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ButtonModule } from 'primeng/components/button/button';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { DataScrollerModule } from 'primeng/components/datascroller/datascroller';
import { FieldsetModule } from 'primeng/components/fieldset/fieldset';
import { SelectButtonModule } from 'primeng/components/selectbutton/selectbutton';
import { InputTextareaModule } from 'primeng/components/inputtextarea/inputtextarea';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { DialogModule } from 'primeng/components/dialog/dialog';
import { DataListModule } from 'primeng/components/datalist/datalist';
import { ToggleButtonModule } from 'primeng/components/togglebutton/togglebutton';
import { PanelMenuModule } from 'primeng/components/panelmenu/panelmenu';
import { TabViewModule } from 'primeng/components/tabview/tabview';
import { PanelModule } from 'primeng/components/panel/panel';
import { MultiSelectModule } from 'primeng/components/multiselect/multiselect';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
import { InputSwitchModule } from 'primeng/components/inputswitch/inputswitch';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { MenuModule } from 'primeng/components/menu/menu';
import { TreeModule } from 'primeng/components/tree/tree';
import { TreeTableModule } from 'primeng/components/treetable/treetable';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { PaginatorModule } from 'primeng/components/paginator/paginator';
import { GrowlModule } from 'primeng/components/growl/growl';
import { FormsModule } from '@angular/forms';
import { EncodingService } from './encoding.service';
import { EncodingApiService } from './api.service';

@NgModule({
  imports: [
    // Angular
    BrowserModule,
    HttpModule,
    RouterModule,
    FormsModule,

    // PrimeNG
    ButtonModule, DataTableModule, DataScrollerModule, DataListModule, DialogModule, ConfirmDialogModule,
    PaginatorModule, InputSwitchModule, CheckboxModule, ToggleButtonModule, DropdownModule, GrowlModule,
    CalendarModule, InputTextModule, MultiSelectModule, PanelMenuModule, InputTextareaModule,
    TreeTableModule, TreeModule, MenuModule, PanelModule, TabViewModule, SelectButtonModule, FieldsetModule,
  ],
  declarations: [
    EncodingScheduleDialogComponent,
    EncodingRouterComponent, EncodingPlayerComponent, EncodingPlayerContainerComponent, EncodingRecordingsComponent,
    EncodingScheduleComponent,
    EncodingControlsComponent, EncodingPlayerRouteComponent, EncodingStreamSelectorComponent, AvermediaControlsComponent,
    EncodingStartStopControlsComponent
  ],
  providers: [
    EncodingService, EncodingApiService
  ]
})
export class EncodingModule {

}
