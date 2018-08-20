import { Component, OnInit } from "@angular/core";
import { SubsidiaryService } from "../_services/subsidiary.service";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

@Component({
  templateUrl: './info.component.html'
})

export class InfoComponent implements OnInit {
  public subsidiaryForm: FormGroup;
  subsidiaryId: string;
  loading: boolean = false;
  constructor(
    private subsidiaryService: SubsidiaryService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.parent.params.subscribe(
      params => this.subsidiaryId = params['id']
    );

    this.subsidiaryForm = this.fb.group({
      name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      rfc: new FormControl('', Validators.required),
      text_ticket: new FormControl('', Validators.required),
      _id: ''
    });

    this.subsidiaryService.subsidiary_details(this.subsidiaryId).subscribe(
      subsidiary => {
        delete subsidiary.subsidiary_number;
        delete subsidiary.__v;
        delete subsidiary.user;
        this.subsidiaryForm.setValue(subsidiary)
      }
    );
  }

  save() {
    this.loading = true;
    this.subsidiaryService.subsidiary_update(this.subsidiaryForm.value).subscribe(
      subsidiary => {
        delete subsidiary.subsidiary_number;
        delete subsidiary.__v;
        delete subsidiary.user;
        this.subsidiaryForm.reset();
        this.subsidiaryForm.setValue(subsidiary);
        this.loading = false;
      }
    )
  }


}
