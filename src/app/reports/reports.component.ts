import { Component } from '@angular/core';
import { PayrollComponent } from './payroll';

export const reportsRoutes = [
  { path: 'payroll', component: PayrollComponent },
  { path: '', redirectTo: 'payroll', pathMatch: 'full' }
];

@Component({
  selector: 'sn-reports',
  template: `<router-outlet></router-outlet>`
})
export class ReportsComponent {
}
