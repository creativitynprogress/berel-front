import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms'
import { Router } from '@angular/router';
@Component({
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

  error: boolean = false;
  loading: boolean = false;
  errorMessage = ''

  loginForm: FormGroup
  email: FormControl
  password: FormControl

  constructor(
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.email = this.fb.control('', Validators.email)
    this.password = this.fb.control('', Validators.required)

    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password
    })
  }

  localLogin() {
    this.loading = true;
    this.errorMessage = '';

    this.authenticationService.localLogin(this.loginForm.value).subscribe(
      response => {
        this.loading = false;
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));

        if ('User' === response.user.role) {
          this.router.navigate(['/']);
        } else if ('Admin' === response.user.role) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate([`/dashboard/subsidiary/${response.user.subsidiary}/box`]);
        }
      },
      error => {
        this.loading = false;
        this.errorMessage = 'Email o contraseña incorrectos.';
      }
    )
  }

}
