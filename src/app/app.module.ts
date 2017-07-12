import { NgModule, APP_INITIALIZER } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { ConfirmationService} from 'primeng/primeng';
import { CapitalizePipe } from './shared/pipes/capitalize.pipe';
import { TimeSincePipe } from './shared/pipes/time-since.pipe';
import { TicketFilterContainerComponent } from './tickets/containers/ticket-filter.container';
import { ChatWindowComponent } from './tickets/components/chat-window.component';
import { TicketCreateComponent } from './tickets/components/ticket-create.component';
import { TicketConversationComponent } from './tickets/components/ticket-conversation.component';
import { TicketDetailsComponent } from './tickets/components/ticket-details.component';
import { TicketListComponent } from './tickets/components/ticket-list.component';
import { TicketListContainerComponent } from './tickets/containers/ticket-list.container';
import { TicketDetailsContainerComponent } from './tickets/containers/ticket-details.container';
import { TicketCreateContainerComponent } from './tickets/containers/ticket-create.container';
import { ServerListComponent } from './dashboard/server-statistics/server-list.component';
import { ServerStatisticsComponent } from './dashboard/server-statistics/server-statistics.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TableComponent } from './dashboard/post-game-analysis/table.component';
import { TicketGroupsComponent } from './tickets/components/ticket-group.component';
import { TicketListRouteComponent } from './tickets/routes/ticket-list.route';
import { TicketDetailsRouteComponent } from './tickets/routes/ticket-details.route';
import { TicketCreateRouteComponent } from './tickets/routes/ticket-create.route';
import { TicketingRouteComponent } from './tickets/routes/ticketing.route';
import { ChatContainerComponent } from './tickets/containers/chat.container';
import { UserActionsComponent } from './navbar/user-top-link.component';
import { SidebarItemComponent } from './navbar/sidebar-item.component';
import { GameDetailsComponent } from './sport/games/game-details.component';
import { GameEventsComponent } from './sport/games/components/game-events.component';
import { GameLineupComponent } from './sport/games/components/game-lineup.component';
import { GameEventDialogComponent } from './sport/games/components/game-event-dialog.component';
import { WebopsRoutingModule } from './app-routing.module';
import { CompareToolComponent, CompareToolFilterComponent } from './sport/compare-tool';

// new sport
import { LeaguesComponent } from './sport/leagues/leagues.component';
// end of new sport

/*
 * =====================================================================================================================
 * todo: refactor
 * =====================================================================================================================
 */
export * from './shared';
export * from './app.component';

import { SETTINGS_PROVIDERS } from './shared';
import { TOKEN_PROVIDERS } from './auth';
import { LoggedInGuard, CheckAccessGuard } from './auth';
import { AuthService } from './auth/auth.service';
import { ServerStatisticsService } from './dashboard/server-statistics/server-statistics.service';
import { LoginComponent } from './auth/login.component';
import { ReportsComponent } from './reports/reports.component';
import { PayrollComponent } from './reports/payroll';
import { PayrollFilterComponent } from './reports/payroll';
import { PayrolPeriodComponent } from './reports/payroll';
import { SelectLoggerComponent, SelectPayrollSortingComponent } from './reports/payroll';
import { GamePhaseComponent } from './shared/components';
import {
  SelectSportComponent, SelectLeagueComponent, SelectCompetitionComponent,
  SelectBaseballLineupComponent, SelectPositionComponent,
  SelectConferenceComponent, SelectDivisionComponent, SelectTeamComponent, SelectbatsThrowsComponent
} from './shared/components';
import {
  HttpSportService,
  OperationsHttpService
} from './shared/services';
import { PayrollService } from './reports/payroll';
import { ContainersComponent } from './dashboard/serverops/containers.component';
import { ContainersService } from './dashboard/serverops/containers.service';
import { IssueTypeFormBuilderComponent } from './tickets/components/issue-type-form-builder.component';
import { AddIssueControlComponent } from './tickets/components/add-issue-control.component';
import { SecurityHttpService } from './shared/services/users.service';
import { NotificationService } from './shared/services/notification.service';
import { LeagueComponent } from './sport/leagues/league.component';
import { NavigationService } from './navbar/navigation.service';
import { AccessDeniedComponent } from './auth/access-denied.component';
import { ErrorComponent } from './auth/error.component';
import { NotFoundComponent } from './auth/not-found.component';
import { SportsComponent } from './sport/sports/sports.component';
import { SportComponent } from './sport/sports/sport.component';
import { AdminRouterComponent } from './admin/admin.router';
import { LoggersMappingComponent } from './admin/loggers-mapping/loggers-mapping.component';
import { DatePipe } from './shared/pipes/date.pipe';
import { EncodingModule } from './encoding/encoding.module';
import {
  EncodingRouteGuard, TicketingRouteGuard, DashboardRouteGuard, AdminRouteGuard,
  ReportsRouteGuard, SportRouteGuard
} from './auth/scope.guard';
import { ConferencesComponent } from './sport/conferences/conferences.component';
import { ConferenceComponent } from './sport/conferences/conference.component';
import { RouterPatch } from './sport/games/router-patch.service';
import { FilterStateService } from './shared/filter-state.service';
import { FilterComponent } from './shared/components/filter/filter.component';
import { DivisionsComponent } from './sport/divisions/divisions.component';
import { DivisionComponent } from './sport/divisions/division.component';
import { TeamsComponent } from './sport/teams/teams.component';
import { TeamComponent } from './sport/teams/team.component';
import { SeasonsComponent } from './sport/seasons/seasons.component';
import { SeasonComponent } from './sport/seasons/season.component';
import { VenuesComponent } from './sport/venues/venues.component';
import { VenueComponent } from './sport/venues/venue.component';
import { CompetitionsComponent } from './sport/competitions/competitions.component';
import { CompetitionComponent } from './sport/competitions/competition.component';
import { PlayersComponent } from './sport/players/players.component';
import { PlayerComponent } from './sport/players/player.component';
import { TraineeInfoComponent } from './admin/loggers-mapping/trainee-info.component';
import { ScrapingModule } from './scraping/scraping.module';
import { SharedModule } from './shared/shared.module';
import { MenuComponent, SubMenuComponent } from './menu.component';
import { SelectTimezoneComponent } from './sport/games/components/select-timezone/select-timezone.component';
import { GameJobsComponent } from './sport/games/components/game-jobs/game-jobs.component';
import { GameStatusComponent } from './sport/games/components/game-status.component';
import { GameMissionComponent } from './sport/games/components/game-mission/game-mission.component';
import { ServerPropertiesComponent } from './dashboard/serverops/dialogs/server.properties.component';
import { ContainerDialogComponent } from './dashboard/serverops/container.dialog.component';
import { JobHandlerPropertiesComponent } from './dashboard/serverops/dialogs/job-handler.preoperties.component';
import { DataCenterPropertiesComponent } from './dashboard/serverops/dialogs/data-center.properties.component';
import { StbDevicePropertiesComponent } from './dashboard/serverops/dialogs/stb-device.properties.component';
import { ServerAssetPropertiesComponent } from './dashboard/serverops/dialogs/server-asset.properties.component';
import { GameTrackerModule } from './game-tracker/game-tracker.module';
import { GeneratePayrollsComponent } from './reports/payroll/generate-payrolls.component';
import { GameOperationsService } from './sport/games/games-operations.service';
import { GameComponent } from './sport/games/game.component';
import { GamesComponent } from './sport/games/games.component';
import { SelectVenueComponent } from './shared/components/select/select-venue.component';
import { SelectSeasonComponent } from './shared/components/select/select-season.component';
import { PayrollListComponent } from './reports/payroll/payroll-list.component';
import { PayrollRowExpansionComponent } from './reports/payroll/payroll-row-expansion.component';
import { PayrollDataStore } from './reports/payroll/payroll-data.store';
import { PayrollFilterStore } from './reports/payroll/payroll-filter.store';
import { TicketingModule } from './tickets/module/ticketing.module';
import { AdjustmentsDetailsComponent } from './reports/payroll/adjustments-details.component';
import { PayrollRecordFormComponent } from './reports/payroll/payroll-record-form.component';

export const GUARDS_PROVIDERS = [
  { provide: LoggedInGuard, useClass: LoggedInGuard },
  { provide: CheckAccessGuard, useClass: CheckAccessGuard },
  { provide: DashboardRouteGuard, useClass: DashboardRouteGuard },
  { provide: TicketingRouteGuard, useClass: TicketingRouteGuard },
  { provide: EncodingRouteGuard, useClass: EncodingRouteGuard },
  { provide: AdminRouteGuard, useClass: AdminRouteGuard },
  { provide: ReportsRouteGuard, useClass: ReportsRouteGuard },
  { provide: SportRouteGuard, useClass: SportRouteGuard },
];

// Application wide providers
export const APP_PROVIDERS = [
  ...SETTINGS_PROVIDERS,
  ...TOKEN_PROVIDERS
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HomeComponent,
    // Menu
    MenuComponent, SubMenuComponent,

    // Login
    LoginComponent,

    // Shared
    SidebarItemComponent, UserActionsComponent, ChatContainerComponent,
    GamePhaseComponent,
    SidebarItemComponent, ChatContainerComponent,
    GamePhaseComponent,
    SelectSportComponent, SelectLeagueComponent, SelectCompetitionComponent,
    SelectBaseballLineupComponent, SelectPositionComponent, SelectDivisionComponent,
    SelectbatsThrowsComponent, SelectTeamComponent, SelectVenueComponent, SelectSeasonComponent,
    SelectConferenceComponent, SidebarItemComponent, AccessDeniedComponent,
    ErrorComponent, SelectBaseballLineupComponent, SelectPositionComponent, SidebarItemComponent,
    NotFoundComponent, FilterComponent,
    // Dashboard
    ServerListComponent, ServerStatisticsComponent, DashboardComponent, TableComponent,
    ContainersComponent, ContainerDialogComponent, ServerPropertiesComponent,
    JobHandlerPropertiesComponent, DataCenterPropertiesComponent, StbDevicePropertiesComponent,
    ServerAssetPropertiesComponent,

    // Payroll
    PayrollComponent, PayrollFilterComponent, PayrolPeriodComponent,
    ReportsComponent, SelectLoggerComponent, SelectPayrollSortingComponent,
    GeneratePayrollsComponent,
    PayrollListComponent, PayrollRowExpansionComponent, AdjustmentsDetailsComponent, PayrollRecordFormComponent,


    // Sport
    GameDetailsComponent, GameLineupComponent, GameEventsComponent, GameEventDialogComponent,
    GameStatusComponent,
    CompareToolComponent, CompareToolFilterComponent,

    // new sport
    SportsComponent, SportComponent,
    LeaguesComponent, LeagueComponent,
    DivisionsComponent, DivisionComponent,
    ConferenceComponent, ConferencesComponent,
    TeamsComponent, TeamComponent,
    SeasonsComponent, SeasonComponent,
    VenuesComponent, VenueComponent,
    CompetitionsComponent, CompetitionComponent,
    PlayersComponent, PlayerComponent,
    // Games
    SelectTimezoneComponent, GameJobsComponent,
    GameComponent, GamesComponent, GameDetailsComponent,

    // Ticketing
    TicketFilterContainerComponent, ChatWindowComponent, TicketCreateComponent, TicketDetailsComponent, TicketingRouteComponent,
    TicketConversationComponent, TicketListComponent, TicketListContainerComponent, TicketDetailsContainerComponent,
    TicketCreateContainerComponent, TicketGroupsComponent, TicketListRouteComponent, TicketDetailsRouteComponent,
    TicketCreateRouteComponent, IssueTypeFormBuilderComponent,
    AddIssueControlComponent,

    // Admin
    AdminRouterComponent, LoggersMappingComponent, TraineeInfoComponent,

    // Pipes
    CapitalizePipe, TimeSincePipe, DatePipe, GameMissionComponent
],
  imports: [ // import Angular's modules
    // Webops
    WebopsRoutingModule,
    EncodingModule,
    ScrapingModule,
    GameTrackerModule,
    SharedModule,
    TicketingModule
  ],
  providers: [
    Title,
    APP_PROVIDERS,
    RouterPatch,
    GUARDS_PROVIDERS,
    HttpSportService,
    PayrollService,
    SecurityHttpService,
    GameOperationsService,
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [AuthService],
      multi: true
    },
    ServerStatisticsService,
    ContainersService,
    ConfirmationService,
    OperationsHttpService,
    NotificationService,
    NavigationService,

    PayrollDataStore,
    PayrollFilterStore,

    // state services
    FilterStateService
  ]
})
export class AppModule {
}

export function appInitializerFactory(auth: AuthService) {
  return () => auth.initialize();
}
