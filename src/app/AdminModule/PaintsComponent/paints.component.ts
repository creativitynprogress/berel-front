import { Component, ViewChild, OnInit } from "@angular/core";
import { Wizard } from "@clr/angular";
import { PaintService } from "../../_services/paint.service";
import { Paint } from "../../_models/paint";
import { LineService } from "../../_services/line.service";
import { Line } from "../../_models/line";
import { Range } from '../../_models/range';

@Component({
  templateUrl: "./paints.component.html"
})
export class PaintsComponent implements OnInit {
  public open: boolean = false;
  @ViewChild("wizard") wizard: Wizard;
  //@ViewChild('fileInput') fileInput;
  public showCancelConfirm: boolean = false;
  public line_selected: string;
  public import: boolean = false;

  public lines: Line[] = [];
  public ranges: Range[] = [];
  public paints: Paint[] = [];
  public paint: Paint = {
    color: "",
    presentations: [],
    line: "",
    range: '',
    base: ''
  };

  public fileToUpload: File = null;

  constructor(
    private paintService: PaintService,
    private lineService: LineService
  ) {}

  ngOnInit() {
    this.lineService.line_list().subscribe(lines => (this.lines = lines));

    this.paintService.paint_list().subscribe(paints => {
      this.paints = paints;
    })
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  upload() {
    const formData = new FormData();
    formData.append('file-to-upload', this.fileToUpload, this.fileToUpload.name);
    console.log(this.fileToUpload)
    console.log(formData)
    this.paintService.upload_file(this.line_selected, formData).subscribe(
      response => {
        console.log(response)
        if (response === 'Looks, like everything upload fine') {
          this.import = false;
          this.paintService.paint_list().subscribe(paints => {
            this.paints = paints;
          })
        }
      }
    )
  }

  public openWizzard(): void {
    this.open = true;
  }

  public openModal() {
    this.import = true;
  }

  public savePaint() {
    if (this.paint.color && this.paint.line) {
      this.paintService.paint_create(this.paint).subscribe(paint => {
        this.paints.push(paint);
        this.paint = {
          color: "",
          presentations: [],
          line: "",
          range: '',
          base: ''
        };
      });
    }
  }

  public deletePaint(paint) {
    this.paintService.paint_delete(paint._id).subscribe(
      response => {
        this.paints = this.paints.filter(p => p._id !== response._id)
      }
    )
  }

  public selectLine() {
    this.lineService.range_list(this.paint.line).subscribe(
      ranges => this.ranges = ranges
    );
  }

  refresh(options) {
    console.log(options)
  }
}
