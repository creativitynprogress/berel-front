import { Component } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { Router } from '@angular/router';
import { PaintService } from '../_services/paint.service';
@Component({
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent {
  public user: any;
  public role;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'))
    this.role = this.user.role;

    if (this.role === 'Manager' || this.role === 'Sales') {
      router.navigate([`/dashboard/subsidiary/${this.user.subsidiary}/box`]);

    }
  }

  logOut() {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
  }
}
