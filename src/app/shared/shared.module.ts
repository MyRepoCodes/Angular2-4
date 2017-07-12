import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './components/page/page.component';
import { ApiService } from './api/api.service';
import { PaginatorComponent } from './components/paginator/paginator.component';
import {
  PaginatorModule, ToggleButtonModule, ButtonModule, DropdownModule, DataTableModule,
  DataScrollerModule, DataListModule, DialogModule, ConfirmDialogModule, GrowlModule, CheckboxModule, InputSwitchModule,
  CalendarModule, TreeTableModule, SpinnerModule, AutoCompleteModule, ToolbarModule, PanelModule, TabViewModule,
  SelectButtonModule, FieldsetModule, TreeModule, InputTextareaModule, MultiSelectModule, PanelMenuModule,
  InputTextModule, MenuModule, OverlayPanelModule
} from 'primeng/primeng';
import { LoadingStatusComponent } from './components/loading-status/loading-status.component';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { OrderByPipe } from './pipes/sn-order-by.pipe';
import { TicketComponent } from './components/tickets/ticket.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { CommentsComponent } from './components/tickets/comments.component';
import { HttpTicketingService } from '../tickets/module/ticketing.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,

    // PrimeNG
    ButtonModule, DataTableModule, DataScrollerModule, DataListModule, DialogModule, ConfirmDialogModule,
    PaginatorModule, InputSwitchModule, CheckboxModule, ToggleButtonModule, DropdownModule, GrowlModule,
    CalendarModule, InputTextModule, MultiSelectModule, PanelMenuModule, InputTextareaModule,
    TreeTableModule, TreeModule, MenuModule, PanelModule, TabViewModule, SelectButtonModule, FieldsetModule,
    SpinnerModule, AutoCompleteModule, ToolbarModule, OverlayPanelModule,
    CommonModule,
  ],
  declarations: [
    PageComponent, PaginatorComponent, LoadingStatusComponent, TableHeaderComponent,
    OrderByPipe, TicketComponent, TicketsComponent, CommentsComponent,
  ],
  exports: [
    PageComponent, PaginatorComponent, PaginatorModule, LoadingStatusComponent, TableHeaderComponent,
    OrderByPipe, TicketComponent, TicketsComponent, CommentsComponent,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,

    // PrimeNG
    ButtonModule, DataTableModule, DataScrollerModule, DataListModule, DialogModule, ConfirmDialogModule,
    PaginatorModule, InputSwitchModule, CheckboxModule, ToggleButtonModule, DropdownModule, GrowlModule,
    CalendarModule, InputTextModule, MultiSelectModule, PanelMenuModule, InputTextareaModule,
    TreeTableModule, TreeModule, MenuModule, PanelModule, TabViewModule, SelectButtonModule, FieldsetModule,
    SpinnerModule, AutoCompleteModule, ToolbarModule, OverlayPanelModule,
    CommonModule,
  ],
  providers: [
    ApiService,
    HttpTicketingService
  ]
})
export class SharedModule {

}
