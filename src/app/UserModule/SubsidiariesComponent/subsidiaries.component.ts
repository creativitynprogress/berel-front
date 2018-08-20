import { Component, OnInit } from '@angular/core';
import { SubsidiaryService } from '../_services/subsidiary.service';
import { Subsidiary } from '../_models/subsidiary';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
@Component({
  templateUrl: './subsidiaries.component.html'
})

export class SubsidiariesComponent implements OnInit {

  public subsidiaries: Subsidiary[] = [];
  public open: boolean = false;

  public subsidiaryForm: FormGroup;
  public name: FormControl;
  public address: FormControl;
  public rfc: FormControl;
  public text_ticket: FormControl;

  constructor(
    private subsidiaryService: SubsidiaryService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {

    this.name = this.fb.control('', Validators.required)
    this.address = this.fb.control('', Validators.required)
    this.rfc = this.fb.control('')
    this.text_ticket = this.fb.control('')

    this.subsidiaryForm = this.fb.group({
      name: this.name,
      address: this.address,
      rfc: this.rfc,
      text_ticket: this.text_ticket
    })

    this.subsidiaryService.subsidiaries_list().subscribe(
      subsidiaries => {
        this.subsidiaries = subsidiaries;
      }
    )
  }

  saveSubsidiary() {
    this.subsidiaryService.subsidiary_create(this.subsidiaryForm.value).subscribe(subsidiary => {
      this.subsidiaries.push(subsidiary)
    })
  }

  public openWizzard(): void {
    this.open = true;
  }

  selectSubsidiary(subsidiary) {
    localStorage.setItem('subsidiary', subsidiary.name)
  }
}
