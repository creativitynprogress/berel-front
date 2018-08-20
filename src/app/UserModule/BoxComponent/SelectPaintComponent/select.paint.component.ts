import { Component, Input, EventEmitter, Output, OnInit } from "@angular/core";
import { SubsidiaryRangeService } from "../../_services/subsidiary.range.service";
import { PaintPriceService } from "../..//_services/paint.price.service";
import { CompleterService, CompleterData, RemoteData } from "ng2-completer";
import { PaintShared } from '../../_shared.ts/paint.shared';
import { ActivatedRoute } from '@angular/router';
import { API_URL } from "../../../_services/API_URL";
import { RequestOptions, Headers } from "@angular/http";

declare const electron: any;

@Component({
  templateUrl: "./select.paint.component.html",
  selector: "select-paint"
})
export class SelectPaintComponent implements OnInit {

  @Output() save = new EventEmitter<any>();

  public lines: any[] = [];
  public lineId: any;
  public paints: any[] = [];
  public paint_selected: any;
  public presentation_selected: any;

  protected searchStr: string = '';
  protected dataService: RemoteData;

  protected search_base: string;
  protected dataServiceBase: CompleterData;
  public base_selected: any;

  public quantity: number = 1;
  public quantity_base: number = 1;
  public sub: any;
  public subsidiaryId: string;

  constructor(
    private subsidiaryRangeService: SubsidiaryRangeService,
    private paintPriceService: PaintPriceService,
    private paintShared: PaintShared,
    private completerService: CompleterService,
    private route: ActivatedRoute
  ) {}

  emitClose() {
    this.paint_selected = null;
    this.presentation_selected = null;
    this.lineId = null;
    this.quantity = 1;
    this.paints = [];
    this.base_selected = null;
    this.quantity_base = 1;
  }

  ngOnInit() {
    this.subsidiaryRangeService
      .line_list()
      .subscribe(lines => (this.lines = lines));

    this.sub = this.route.parent.parent.params.subscribe(
      params => this.subsidiaryId = params['id']
    )

    this.dataServiceBase = this.completerService.local(
      this.paintPriceService.base_list_for_sale(this.subsidiaryId),
      "base.product_id", "base.product_id")
  }

  selectPresentation(presentation) {
    this.presentation_selected = presentation;
  }

  selectPaint(selected) {
    this.paintPriceService.paint_details(selected.originalObject._id).subscribe(response => {
      this.paint_selected = response;
    });
  }

  selectLine(lineId) {
    this.lineId = lineId;
    /* this.paintPriceService.paint_list(lineId).subscribe(paints => {
      this.paints = paints;
      this.paints_display = this.paints;
    }); */

    /* this.dataService = this.completerService.local(
      this.paintPriceService.paint_list_search({line: lineId, search: new RegExp(this.searchStr)}),
      "color",
      "color"
    ); */

    const headers = new Headers();
    headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)

    const requestOptions: RequestOptions = new RequestOptions({
      headers: headers
    });

    this.dataService = this.completerService
    .remote(
      `${API_URL}/api/paint/search/?lineId=${this.lineId}&search=${this.searchStr}`,
      'color',
      'color'
    )

    this.dataService.requestOptions(requestOptions)
  }

  savePaint() {
    const paintItem = {
      line: this.paint_selected.line.name,
      base: this.paint_selected.base,
      color: this.paint_selected.color,
      presentation: this.presentation_selected.name,
      quantity: this.quantity,
      price:
        this.presentation_selected && this.presentation_selected.salePrice
          ? this.presentation_selected.salePrice * this.quantity
          : this.presentation_selected.suggestedPrice * this.quantity,
      paint: this.paint_selected._id,
      presentationId: this.presentation_selected._id
    };

    this.paintShared.add_paint(paintItem);
    this.emitClose();
  }

  selectBase(base) {
    this.base_selected = base.originalObject;
  }

  saveBase() {
    const baseItem = {
      line: this.base_selected.base.line.name,
      product_id: this.base_selected.base.product_id,
      presentation: this.base_selected.base.presentation,
      quantity: this.quantity_base,
      price: this.base_selected.salePrice ?
      this.base_selected.salePrice * this.quantity_base :
      this.base_selected.base.suggestedPrice * this.quantity_base,
      description: this.base_selected.base.description
    }

    this.paintShared.add_base(baseItem);
    this.emitClose();
  }

  printPresentation() {
    const BrowserWindow = electron.remote.BrowserWindow;
    const win = new BrowserWindow({ width: 450, height: 600 });
    let inks = [];

    this.presentation_selected.elements.forEach(e => {
      inks.push(`
        <tr>
          <td>${e.ink}</td>
          <td>${e.ounce}</td>
          <td>${e.ouncePart}</td>
        </tr>
      `)
    })

    const html = [
      `<head>
      <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/clarity-ui/0.10.23/clarity-ui.min.css">
      </head>`,
      '<body>',
      `<h1 style="text-align: center;">${this.paint_selected.color} ${this.presentation_selected.name}</h1>`,
      '<div class="container-fluid">',
      `<table class="table">
        <thead>
          <tr>
            <th>Tinta</th>
            <th>Onzas</th>
            <th>Partes de onza</th>
          </tr>
        </thead>
        <tbody>
          ${inks.join('')}
        </tbody>
      <table>`,
      '</div>',
      '</body>',
    ].join("");
    win.loadURL("data:text/html;charset=utf-8," + encodeURI(html));
    win.show();
    win.setMenu(null);

    setTimeout(() => {
      win.webContents.print({ silent: true });
    }, 1000);
  }
}
