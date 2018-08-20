import { Component } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { Router } from '@angular/router';
@Component({
  templateUrl: './admin.component.html'
})

export class AdminComponent {
  public user: any;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'))
  }

  logOut() {
    this.authenticationService.logOut();
    this.router.navigate(['/']);
  }
}
