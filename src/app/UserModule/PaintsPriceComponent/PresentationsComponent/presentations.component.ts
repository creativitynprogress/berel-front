import { Component, OnInit, Input } from '@angular/core';
import { PaintPriceService } from '../../_services/paint.price.service';
import { PaintPrice } from '../../_models/paint.price';

declare const electron: any;

@Component({
  selector: 'presentation-details',
  templateUrl: './presentations.component.html'
})

export class PresentationsDetails implements OnInit {
  @Input() paint: PaintPrice;
  paint_details: any = {presentations: []};
  presentation_selected: any;
  loading: boolean;

  constructor(
    private paintPriceService: PaintPriceService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.paintPriceService.paint_details(this.paint._id).subscribe(
      paint => {
        this.paint_details = paint;
        this.loading = false;
      }
    )
  }

  selectPresentation(presentation) {
    this.presentation_selected = presentation;
  }

  printPresentation() {
    console.log(this.paint_details)
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
      `<h1 style="text-align: center;">${this.paint_details.color} ${this.presentation_selected.name}</h1>`,
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
