import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { PaintService } from "../../../_services/paint.service";

@Component({
  selector: "presentation-component",
  template: `
  <clr-modal [(clrModalOpen)]="opened" [clrModalClosable]="false" [clrModalSize]="'xl'" *ngIf="presentation">
  <div class="modal-body">

  <!-- Alerta en caso de error -->
  <div class="alert alert-danger" *ngIf="error">
    <div class="alert-items">
        <div class="alert-item static">
            <div class="alert-icon-wrapper">
                <clr-icon class="alert-icon" shape="exclamation-circle"></clr-icon>
            </div>
            <span class="alert-text">{{error}}</span>
        </div>
    </div>
  </div>

   <form>
    <section class="form-block">
      <div class="form-group">
        <label>Presentación</label>
        <label *ngIf="presentation._id">{{presentation.name}}</label>
        <div class="select" *ngIf="!presentation._id">
          <select name="name" [(ngModel)]="presentation.name">
            <option *ngFor="let name of presentations_options" [value]="name">{{name}}</option>
          </select>
        </div>
      </div>
    </section>
   </form>

      <table class="table">
        <thead>
            <tr>
                <th>Colorante</th>
                <th>Onza</th>
                <th>Parte de onza</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                  <div class="select" >
                    <select [(ngModel)]="ink">
                      <option *ngFor="let inkName of inks" [value]="inkName">{{inkName}}</option>
                    </select>
                  </div>
                </td>
                <td><input type="number" [(ngModel)]="ounce"></td>
                <td><input type="number" [(ngModel)]="ouncePart"></td>
                <td>
                  <button (click)="saveInk()" type="button" class="btn btn-icon" [disabled]="!ink ">
                    <clr-icon shape="plus"></clr-icon>
                  </button>
                </td>
            </tr>
            <tr *ngFor="let element of presentation.elements">
              <td>{{element.ink}}</td>
              <td>{{element.ounce}}</td>
              <td>{{element.ouncePart}}</td>
              <td>
                <button (click)="removeInk(element)" type="button" class="btn btn-icon">
                    <clr-icon shape="times"></clr-icon>
                </button>
              </td>
            </tr>
        </tbody>
    </table>
  </div>
  <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
      <button type="button" class="btn btn-primary" (click)="savePresentation()" [disabled]="!presentation.name">
          Guardar
      </button>
  </div>
</clr-modal>
  `
})
export class PresentationComponent  {
  @Input() opened: boolean = false;
  @Input() paintId: string;
  @Input() presentation: any;

  @Output() close = new EventEmitter<boolean>();
  @Output() updatePresentations = new EventEmitter<any>();

  @Input() presentations_options: string[] = [];
  public inks: string[] = [
    "Exterior yellow (AXX)",
    "Lamp black (B)",
    "Yellow oxide (C)",
    "Pthalo green (D)",
    "Pthalo blue (E)",
    "Red iron oxide (F)",
    "Brown iron oxide (I)",
    "Raw umber (L)",
    "Exterior red (R)",
    "Medium yellow (T)",
    "Magenta (V)",
    "Tinta blanca (KX)"
  ];

  public ink: string;
  public ounce: number;
  public ouncePart: number;

  public error: string = "";

  constructor(private paintService: PaintService) {}


  saveInk() {
    const ink = {
      ink: this.ink,
      ounce: this.ounce,
      ouncePart: this.ouncePart
    };

    this.presentation.elements.push(ink);
    /* this.inks = this.inks.filter(i => i !== this.ink); */

    this.ink = this.ounce = this.ouncePart = null;
  }

  removeInk(element) {
    this.presentation.elements = this.presentation.elements.filter(
      i => i.ink !== element.ink
    );
    this.inks.push(element.ink);
  }

  savePresentation() {
    if (this.presentation._id) {
      this.paintService
        .paint_update_presentation(this.paintId, this.presentation)
        .subscribe(presentations => {
          this.updatePresentations.emit(presentations);
          this.closeModal();
          this.error = "";
        }, error => (this.error = "Parece que hubo un error, por favor intentalo más tarde."));
    } else {
      this.paintService
        .paint_add_presentation(this.paintId, this.presentation)
        .subscribe(presentations => {
          this.updatePresentations.emit(presentations);
          this.closeModal();
          this.error = "";
        }, error => (this.error = "Parece que hubo un error, por favor intentalo más tarde."));
    }
  }

  closeModal() {
    this.close.emit(false);
  }
}
