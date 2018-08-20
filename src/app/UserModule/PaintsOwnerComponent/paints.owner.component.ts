import { Component, ViewChild, OnInit } from "@angular/core";
import { Wizard } from "@clr/angular";
import { PaintService } from "../../_services/paint.service";
import { Paint } from "../../_models/paint";
import { LineService } from "../../_services/line.service";
import { Line } from "../../_models/line";
import { Range } from "../../_models/range";

@Component({
  templateUrl: "./paints.owner.component.html"
})
export class PaintsOwnerComponent implements OnInit {
  public open: boolean = false;
  @ViewChild("wizard") wizard: Wizard;
  public showCancelConfirm: boolean = false;

  public lines: Line[] = [];
  public ranges: Range[] = [];
  public paints: Paint[] = [];
  public paint: Paint = {
    color: "",
    presentations: [],
    line: "",
    range: "",
    base: "",
    user: ''
  };
  private user: any;

  constructor(
    private paintService: PaintService,
    private lineService: LineService
  ) {}

  ngOnInit() {
    this.lineService.line_list().subscribe(lines => (this.lines = lines));

    this.paintService.paint_owner_list().subscribe(paints => {
      this.paints = paints;
    });

    this.user = JSON.parse(localStorage.getItem('currentUser'))
  }

  public openWizzard(): void {
    this.open = true;
  }

  public savePaint() {
    if (this.paint.color && this.paint.line) {
      this.paint.user = this.user._id;
      this.paintService.paint_create(this.paint).subscribe(paint => {
        this.paints.push(paint);
        this.paint = {
          color: "",
          presentations: [],
          line: "",
          range: "",
          base: ""
        };
      });
    }
  }

  public deletePaint(paint) {
    this.paintService.paint_delete(paint._id).subscribe(response => {
      this.paints = this.paints.filter(p => p._id !== response._id);
    });
  }

  public selectLine() {
    this.lineService
      .range_list(this.paint.line)
      .subscribe(ranges => (this.ranges = ranges));
  }
}
