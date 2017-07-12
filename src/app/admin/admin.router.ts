import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoggersMappingComponent } from './loggers-mapping/loggers-mapping.component';


export const adminRoutes: Routes = [
  { path: 'loggers-mapping', component: LoggersMappingComponent }
];


@Component({
  template: `<router-outlet></router-outlet>`
})

export class AdminRouterComponent {

}
