import { Component } from '@angular/core';
@Component({
  templateUrl: './subsidiary.component.html'
})

export class SubsidiaryComponent {
  public subsidiary_name: string;
  public role;
  constructor() {
    this.subsidiary_name = localStorage.getItem('subsidiary')
    this.role = JSON.parse(localStorage.getItem('currentUser')).role
  }
}
