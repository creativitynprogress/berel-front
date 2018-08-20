import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';
import { SnotifyService } from 'ng-snotify';
@Component({
  templateUrl: './employee.component.html'
})

export class EmployeeComponent implements OnInit, OnDestroy {

  wizzard: boolean = false;
  wizzard2: boolean = false;
  sub: any;
  subsidiaryId: string;
  employees: any[] = []

  employeeForm: FormGroup
  name: FormControl
  email: FormControl
  role: FormControl
  password: FormControl
  public user:any;

  public employee_selected: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('currentUser'));

    this.sub = this.route.parent.params.subscribe(
      params => this.subsidiaryId = params['id']
    )

    this.name = this.fb.control('', Validators.required)
    this.email = this.fb.control('', Validators.required)
    this.role = this.fb.control('', Validators.required)
    this.password = this.fb.control('', Validators.required)

    this.employeeForm = this.fb.group({
      full_name: this.name,
      email: this.email,
      role: this.role,
      password: this.password,
      _id: ''
    })

    this.userService.employee_list(this.subsidiaryId).subscribe(
      employees => {
        this.employees = employees;
      }
    )
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  addEmployee() {
    this.wizzard = true;
  }

  saveEmployee() {
    if (this.employeeForm.value._id === '') {
      delete this.employeeForm.value._id;
    }
    this.userService.employee_create(this.subsidiaryId, this.employeeForm.value).subscribe(
      employee => {
        this.employees.push(employee);
      }
    );
  }

  update_state(employee_id, state) {
    this.userService.employee_state(this.subsidiaryId, employee_id, {enable: !state}).subscribe(
      employee => {
        this.employees = this.employees.map(e => {
          if (e._id === employee._id) {
            e = employee;
          }
          return e;
        })
      },
      error => {
        const reason = JSON.parse(error._body);
        if (reason.error.includes('duplicate key error')) {
          this.snotifyService.error('Este email, ya esta registrado.')
        }
      }
    )
  }

  updateEmployee() {
    if (this.employee_selected.password == null || this.employee_selected.password == '') {
      delete this.employee_selected.password;
    }
    this.userService.employee_update(this.subsidiaryId, this.employee_selected).subscribe(
      employee_c => this.employees = this.employees.map( e => {
        if (e._id == employee_c._id) {
          e = employee_c;
        }

        return e;
      }),
      error => {
        const reason = JSON.parse(error._body);
        if (reason.error.includes('duplicate key error')) {
          this.snotifyService.error('Este email, ya esta registrado.')
        }
      }
    )
  }

  selectEmployee(employee) {
    this.employee_selected = Object.assign({}, employee);
  }
}
