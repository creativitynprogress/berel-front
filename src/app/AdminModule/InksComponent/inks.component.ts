import { Component, OnInit } from '@angular/core';
import { PaintService } from '../../_services/paint.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './inks.component.html'
})

export class InksComponent implements OnInit {
  open: boolean = false;
  inks: any[] = []

  inkForm: FormGroup;
  description: FormControl;
  product_id: FormControl;
  bar_code: FormControl;
  price: FormControl;

  constructor(
    private paintService: PaintService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.paintService.ink_list().subscribe(
      inks => {
        this.inks = inks;
      }
    )

    this.description = this.fb.control('', Validators.required)
    this.product_id = this.fb.control('', Validators.required)
    this.bar_code = this.fb.control('')
    this.price = this.fb.control('', Validators.required)

    this.inkForm = this.fb.group({
      description: this.description,
      product_id: this.product_id,
      bar_code: this.bar_code,
      price: this.price
    })
  }

  openWizzard() {
    this.open = true;
  }

  saveInk() {
    this.paintService.ink_create(this.inkForm.value).subscribe(
      ink => {
        this.inks.push(ink);
      }
    )

    this.inkForm.reset();
  }
}
