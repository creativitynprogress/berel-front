import {Component, OnInit} from '@angular/core'
import { Provider } from '../_models/providers';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../_services/user.service';

@Component({
  templateUrl: './providers.component.html'
})

export class ProvidersComponent implements OnInit {

  public providers: Provider[] = [];

  public providerForm: FormGroup;
  public name: FormControl;
  public address: FormControl;
  public email: FormControl;

  public provider_modal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {

    this.userService.provider_list().subscribe(
      providers => {
        this.providers = providers;
      }
    );

    this.name = this.fb.control('', Validators.required)
    this.address = this.fb.control('', Validators.required)
    this.email = this.fb.control('', Validators.required)

    this.providerForm = this.fb.group({
      _id: '',
      name: this.name,
      address: this.address,
      email: this.email
    })
  }

  open_form(provider?) {
    if (provider) {
      this.providerForm.setValue(provider);
    }
    this.provider_modal = true;
  }

  saveProvider() {
    if (this.providerForm.value._id) {

    } else {
      delete this.providerForm.value._id;

      this.userService.provider_create(this.providerForm.value).subscribe(
        provider => {
          this.providers.push(provider)
          this.provider_modal = false;
          this.providerForm.reset()
        }
      )
    }
  }
}
