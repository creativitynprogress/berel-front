import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaintService } from '../../../_services/paint.service';
import { ActivatedRoute } from '@angular/router';
import { Paint } from '../../../_models/paint';
@Component({
  templateUrl: './paint.component.html'
})

export class PaintComponent implements OnInit, OnDestroy {

  public paint: Paint = null;
  public paintId: string;
  public sub: any;
  public opened: boolean;
  public presentations_options: string[] = ['1L', '4L', '19L'];
  public presentation_selected: any = {name: '', elements: [], price: null};

  constructor(
    private paintsService: PaintService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.paintId = params['paintId']
      this.paintsService.paint_details(this.paintId).subscribe(
        paint => {
          this.paint = paint;
        }
      )
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  openPresentation(presentation: any = {name: '', elements: [], base: ''}) {
    this.presentation_selected = presentation;
    this.presentations_options = this.presentations_options.filter(p => {
      if (!this.paint.presentations.find(pr => pr.name === p)) {
        return p;
      }
    })
    this.opened = true;
  }

  closeModal(value) {
    this.opened = value;
  }

  updatePresentations(presentations) {
    this.paint.presentations = presentations;
    this.presentations_options = this.presentations_options = ['1L', '4L', '19L'];
    this.presentations_options.filter(p => {
      if (!this.paint.presentations.find(pr => pr.name === p)) {
        return p;
      }
    })
  }

}
