import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  templateUrl: './menu.component.html'
})

export class MenuComponent implements OnInit, OnDestroy {

  private sub: any;
  public subsidiaryId: string;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sub = this.route.parent.parent.params.subscribe(
      params => this.subsidiaryId = params['id']
    )
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
