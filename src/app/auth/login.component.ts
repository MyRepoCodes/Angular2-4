import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationService } from '../navbar/navigation.service';

@Component({
  selector: 'sn-login-component',
  templateUrl: 'login.component.html'

})
export class LoginComponent {
  loginBtnText = 'Login';
  loggingIn = false;
  error = false;
  checked = false;
  username = '';
  password = '';
  errorMsg = '';

  constructor(private authService: AuthService,
    private navigationService: NavigationService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  onLogin() {
    this.error = false;
    this.loggingIn = true;
    this.loginBtnText = 'Logging In...';
    this.authService.login(this.username, this.password).subscribe(res => {
      if (res) {
        let url = this.authService.redirectUrl;
        if (!url || url === '/') {
          url = this.navigationService.getStartUrl();
        }

        if (typeof url === 'string') {
          url = [url];
        }
        this.router.navigate(url).then(success => {
          if (!success) {
            this.loggingIn = false;
            this.loginBtnText = 'Login';
            // this.errorMsg = 'This user does not have access to enter WebOps';
            this.router.navigate(['/access-denied'], { relativeTo: this.route });
            this.error = true;
          }
        });
      } else {
        this.loggingIn = false;
        this.loginBtnText = 'Login';
        this.errorMsg = 'Login or Password incorrect.';
        this.error = true;
      }
    });
    return false;
  }
}
