import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router'
@Injectable()

export class AdminGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user && user.role === 'Admin') {
          return true;
      }
      this.router.navigate(['/']);
      return false;
  }
}
