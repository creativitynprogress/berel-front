import { Component, OnInit } from '@angular/core';
import { CompleterService, CompleterData } from "ng2-completer";
import { ClientShared } from '../../_shared.ts/client.shared';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './select.client.component.html'
})

export class SelectClientComponent implements OnInit {

  protected searchStr: string;
  protected dataService: CompleterData;
  public client: any;
  public subsidiaryId: string;
  public sub: any;

  public clientForm: FormGroup;
  public name: FormControl;
  public rfc: FormControl;
  public address: FormControl;
  public email: FormControl;
  public phone: FormControl;
  public postal_code: FormControl;

  constructor(
    private completerService: CompleterService,
    private clientShared: ClientShared,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.dataService = this.completerService.local(
      this.userService.client_list(),
      "name,rfc",
      "name,rfc"
    );

    this.sub = this.route.parent.parent.params.subscribe(
      params => this.subsidiaryId = params['id']
    )

    this.name = this.fb.control('', Validators.required);
    this.rfc = this.fb.control('', Validators.required);
    this.email = this.fb.control('');
    this.phone = this.fb.control('', Validators.required);
    this.postal_code = this.fb.control('', Validators.required);

    this.clientForm = this.fb.group({
      name: this.name,
      rfc: this.rfc,
      address: this.address,
      email: this.email,
      phone: this.phone,
      postal_code: this.postal_code
    })
  }

  selectClient(select) {
    this.client = select.originalObject;
  }

  add_client() {
    this.clientShared.add_client(this.client);
    this.router.navigate([`/dashboard/subsidiary/${this.subsidiaryId}/box`]);
  }

  saveClient() {
    this.userService.client_create(this.clientForm.value).subscribe(
      client => {
        this.clientShared.add_client(client);
        this.router.navigate([`/dashboard/subsidiary/${this.subsidiaryId}/box`]);
      }
    )
  }
}
