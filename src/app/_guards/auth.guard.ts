import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRoute } from '@angular/router'
@Injectable()

export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  canActivate() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if ( user && user.role === 'Admin') {
      this.router.navigate(['/admin']);
    }

    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
