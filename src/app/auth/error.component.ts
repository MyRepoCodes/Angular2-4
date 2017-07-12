import { Component } from '@angular/core';
import { NavigationService } from '../navbar/navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'sn-access-denied',
  templateUrl: 'error.component.html'
})
export class ErrorComponent {
  constructor(private navigationService: NavigationService,
              private router: Router) {

  }

  public goToStartPage() {
    const url = this.navigationService.getStartUrl();
    this.router.navigate(url);
  }

  public goToLoginPage() {
    this.router.navigate(['/auth']);
  }
}
