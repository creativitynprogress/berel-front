import { Component } from '@angular/core';
import { LineService } from '../../_services/line.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Line } from '../../_models/line';
import {Range} from '../../_models/range';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
@Component({
  templateUrl: './lines.component.html'
})

export class LinesComponent implements OnInit {
  public lines: Line[] = [];
  public ranges: Range[] = [];
  public range_selected: Range;
  public updateRangeModal: boolean = false;
  public newLine: boolean = false;
  public newRange: boolean = false;
  public deleteRangeModal: boolean = false;
  public loading_ranges: boolean = false;
  public line_name: string;
  public line_category: string;
  public categories: string[] = ["Base agua", "Esmaltes"];
  public line_selected: Line = { _id: null, name: '', category: ''};

  public rangeForm: FormGroup;
  public range: FormControl;
  public liter: FormControl;
  public gallon: FormControl;
  public bucket: FormControl;

  public ranges_options = ['R-1', 'R-2', 'R-3'];
  constructor(
    private lineService: LineService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.lineService.line_list().subscribe(
      lines => this.lines = lines
    )

    this.range = this.fb.control('', Validators.required)
    this.liter = this.fb.control('', Validators.required)
    this.gallon = this.fb.control('', Validators.required)
    this.bucket = this.fb.control('', Validators.required)

    this.rangeForm = this.fb.group({
      range: this.range,
      liter: this.liter,
      gallon: this.gallon,
      bucket: this.bucket
    })
  }

  openNewLine() {
    this.newLine = true;
  }

  openNewRange() {
    this.newRange = true;
  }

  openUpdateRange(range) {
    this.range_selected = range;
    this.updateRangeModal = true;
  }

  createLine() {
    this.lineService.line_create({name: this.line_name, category: this.line_category} as Line).subscribe(
      line => {
        this.lines.push(line)
        this.line_name = null;
        this.newLine = false;
      }
    )
  }

  selectLine(line) {
    this.line_selected = line;
    this.loading_ranges = true;
    this.lineService.range_list(this.line_selected._id).subscribe(
      ranges => {
        this.ranges = ranges;
        this.ranges_options = ['R-1', 'R-2', 'R-3'];
        this.ranges_options = this.ranges_options.filter(o => {
          if (!this.ranges.find(r => r.range === o)) {
            return o;
          }
        })
        if (this.ranges_options.length > 0) {
          this.range.setValue(this.ranges_options[0])
        }
        this.loading_ranges = false;
      }
    )
  }

  createRange() {
    this.lineService.range_create(this.line_selected._id, this.rangeForm.value).subscribe(
      range => {
        this.ranges.push(range)
        this.rangeForm.reset();
        this.ranges_options = this.ranges_options.filter(o => {
          if (!this.ranges.find(r => r.range === o)) {
            return o;
          }
        })
        if (this.ranges_options.length > 0) {
          this.range.setValue(this.ranges_options[0])
        }
        this.newRange = false;
      }
    )
  }

  updateRange() {
    this.lineService.range_update(this.line_selected._id, this.range_selected).subscribe(
      range => {
        this.ranges = this.ranges.map(r => {
          if (r._id === range._id) { r = range; }
          return r;
        });
        this.updateRangeModal = false;
      }
    )
  }

  showDeleteModal(range) {
    this.range_selected = range;
    this.deleteRangeModal = true;
  }

  deleteRange() {
    this.lineService.range_delete(this.line_selected._id, this.range_selected._id).subscribe(
      range => {
        this.ranges = this.ranges.filter(r => r._id !== range._id);
        this.ranges_options.push(range.range);
        this.deleteRangeModal = false;
        })
  }


}
