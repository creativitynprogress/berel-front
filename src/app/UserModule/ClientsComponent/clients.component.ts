import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
@Component({
  templateUrl: './clients.component.html'
})

export class ClientsComponent implements OnInit {
  public clients: any[] = []
  public open_form: boolean = false;

  public clientForm: FormGroup;
  public name: FormControl;
  public rfc: FormControl;
  public address: FormControl;
  public email: FormControl;
  public phone: FormControl;
  public postal_code: FormControl;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.userService.client_list().subscribe(
      clients => this.clients = clients
    )

    this.name = this.fb.control('', Validators.required);
    this.rfc = this.fb.control('', Validators.required);
    this.email = this.fb.control('');
    this.phone = this.fb.control('', Validators.required);
    this.postal_code = this.fb.control('', Validators.required);

    this.clientForm = this.fb.group({
      _id: '',
      name: this.name,
      rfc: this.rfc,
      address: this.address,
      email: this.email,
      phone: this.phone,
      postal_code: this.postal_code
    })
  }

  openModal(client?) {
    if (client) {
      delete client.updatedAt;
      delete client.createdAt;
      delete client.user;
      client.postal_code ? client.postal_code = client.postal_code : client.postal_code = '';
      this.clientForm.setValue(client)
    }
    this.open_form = true;
  }

  saveClient() {
    if (this.clientForm.value._id) {
      this.userService.client_update(this.clientForm.value).subscribe(
        client => {
          this.clients = this.clients.map(c => {
            if (c._id === client._id) {
              c = client;
            }
            return c;
          })
          this.clientForm.reset()
          this.open_form = false;
        }
      )
    } else {
      delete this.clientForm.value._id;
      this.userService.client_create(this.clientForm.value).subscribe(
        client => {
          this.clients.push(client)
          this.clientForm.reset()
          this.open_form = false;
        }
      )
    }
  }
}
