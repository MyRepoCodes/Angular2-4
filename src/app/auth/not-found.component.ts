import { Component } from '@angular/core';
import { NavigationService } from '../navbar/navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'sn-not-found',
  templateUrl: 'not-found.component.html'
})
export class NotFoundComponent {
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
