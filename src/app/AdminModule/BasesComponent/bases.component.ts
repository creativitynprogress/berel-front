import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PaintService } from '../../_services/paint.service';
import { Base } from '../_models/base';
import { LineService } from '../../_services/line.service';
import { Line } from '../../_models/line';
import { BaseResponseOptions } from '@angular/http';
@Component({
  templateUrl: './bases.component.html'
})

export class BasesComponent implements OnInit {

  public open: boolean = false;
  public bases: Base[] = [];
  public lines: Line[] = [];

  public baseForm: FormGroup;
  public line: FormControl;
  public presentation: FormControl;
  public product_id: FormControl;
  public bar_code: FormControl;
  public price: FormControl;
  public base: FormControl;
  public suggestedPrice: FormControl;
  public can_sell: FormControl;
  public description: FormControl;

  constructor(
    private fb: FormBuilder,
    private paintService: PaintService,
    private lineService: LineService
  ) {}

  ngOnInit() {
    this.lineService.line_list().subscribe(
      lines => {
        this.lines = lines;
      }
    )

    this.paintService.base_list().subscribe(
      bases => this.bases = bases
    )

    this.line = this.fb.control('', Validators.required)
    this.presentation = this.fb.control('', Validators.required)
    this.product_id = this.fb.control('', Validators.required)
    this.bar_code = this.fb.control('')
    this.price = this.fb.control('', Validators.required)
    this.base = this.fb.control('', Validators.required)
    this.suggestedPrice = this.fb.control('')
    this.can_sell = this.fb.control(false)
    this.description = this.fb.control('', Validators.required);

    this.baseForm = this.fb.group({
      _id: '',
      line: this.line,
      presentation: this.presentation,
      product_id: this.product_id,
      bar_code: this.bar_code,
      price: this.price,
      base: this.base,
      suggestedPrice: this.suggestedPrice,
      can_sell: this.can_sell,
      description: this.description
    })
  }

  openWizzard(base?) {
    if (base) {
      this.baseForm.setValue(base);
    }
    this.open = true;
  }

  saveBase() {
    if (this.baseForm.value._id) {
      this.paintService.base_update(this.baseForm.value).subscribe(
        base => {
          this.bases = this.bases.filter(b => b._id !== base._id)
        }
      )

      this.baseForm.reset()
    } else {
      delete this.baseForm.value._id;
      this.paintService.base_create(this.baseForm.value).subscribe(
        base => {
          this.bases.push(base);
        }
      )

      this.baseForm.reset()
    }
  }

  setOrRemoveSell(base) {
    base.can_sell = !base.can_sell;
    this.paintService.base_update(base).subscribe(
      baser => {
        this.bases = this.bases.map(b => {
          if (b._id === baser._id) {
            b = baser;
          }

          return b;
        })
      }
    )
  }

}
