import { Component, ViewChild, OnInit } from '@angular/core';
import { PaintPriceService } from '../_services/paint.price.service';
import { PaintPrice } from '../_models/paint.price';
import {ClrDatagridStringFilterInterface} from "@clr/angular";

class StringFilter implements ClrDatagridStringFilterInterface<PaintPrice> {
    accepts(paint: PaintPrice, search: string):boolean {
        return paint.color.toLowerCase().indexOf(search) >= 0;
    }
}

@Component({
  templateUrl: './paints.price.component.html'
})
export class PaintsPriceComponent implements OnInit {

  public paints: PaintPrice[] = [];
  public stringFilter = new StringFilter();

  constructor(
    private paintService: PaintPriceService
  ) {}

  ngOnInit() {
    this.paintService.paint_list().subscribe(
      paints => this.paints = paints
    )
  }
}
