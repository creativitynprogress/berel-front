/* import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: '[row-element]',
  template: `
  <td [ngClass]="{'selected': selected}">{{element?.base?.name}}</td>
  <td [ngClass]="{'selected': selected}">{{element?.base?.category}}</td>
  <td [ngClass]="{'selected': selected}">
    <div class="select">
      <select id="aForm_3" [(ngModel)]="element.unit" [disabled]="selected">
          <option *ngFor="let unit of units" [value]="unit.value">{{unit.unit}}</option>
      </select>
    </div>
  </td>
  <td [ngClass]="{'selected': selected}">
    <input type="number" [(ngModel)]="element.quantity" [disabled]="selected">
  </td>
  <td [ngClass]="{'selected': selected}">
    <a (click)="selectOrRemoveElement()">
      <clr-icon shape="plus" *ngIf="!selected"></clr-icon>
      <clr-icon shape="window-close" *ngIf="selected"></clr-icon>
    </a>
  </td>

  <style>
    .selected {
      background-color: #e57373;
    }
  </style>
  `
})

export class RowElement implements OnInit {

  /* @Input('element') element: Element;
  @Output() elementSelected = new EventEmitter<Element>();
  @Output() elementRemoved = new EventEmitter<Element>();
  public selected: boolean = false

  public units: any[] = [
    { unit: 'Gramos', value: 'g' },
    { unit: 'Kilogramos', value: 'kg' },
    { unit: 'Toneladas', value: 'ton' },
    { unit: 'Libras', value: 'lb' },
    { unit: 'Mililitros', value: 'ml' },
    { unit: 'Litros', value: 'l' },
    { unit: 'Galones', value: 'ga' },
    { unit: 'Onzas', value: 'oz' },
    { unit: 'Piezas', value: 'pza' }
];
  public unit: string = '';

  constructor() {}

  ngOnInit() {
      /* if (this.element.base.unit === 'g') {
        this.units = [
          { unit: 'Gramos', value: 'g' },
          { unit: 'Kilogramos', value: 'kg' },
          { unit: 'Toneladas', value: 'ton' },
          { unit: 'Libras', value: 'lb' },
        ];
        this.unit = 'g';
      } else if (this.element.base.unit === 'ml') {
        this.units = [
          { unit: 'Mililitros', value: 'ml' },
          { unit: 'Litros', value: 'l' },
          { unit: 'Galones', value: 'ga' },
          { unit: 'Onzas', value: 'oz' },
        ];
        this.unit = 'ml';
      } else {
        this.units = [
          { unit: 'Piezas', value: 'pza' }
        ];
        this.unit = 'pza';
      }

  }

  selectOrRemoveElement() {
    /* if (this.element.quantity && this.element.unit) {
        this.selected = !this.selected;
        if (this.selected) {
          this.elementSelected.emit(this.element);
        } else {
          this.elementRemoved.emit(this.element);
        }
      }
  }

} */
