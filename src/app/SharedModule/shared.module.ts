import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaintComponent } from '../AdminModule/PaintsComponent/PaintComponent/paint.component';
import { PresentationComponent } from '../AdminModule/PaintsComponent/PaintComponent/presentation.component';
import { ClarityModule } from "@clr/angular";
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule
  ],
  declarations: [
    PresentationComponent
  ],
  exports: [
    PresentationComponent
  ]
})

export class SharedModule {}
