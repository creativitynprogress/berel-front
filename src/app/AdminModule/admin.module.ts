import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { LinesComponent } from './LinesComponent/lines.component';
import { PaintsComponent } from './PaintsComponent/paints.component';
import { ProductsComponent } from './ProductsComponent/products.component';
import { UsersComponent } from './UsersComponent/users.component';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../SharedModule/shared.module';
import { ClarityModule } from "@clr/angular";
import { PaintComponent } from './PaintsComponent/PaintComponent/paint.component';
import { ProductService } from './_services/product.service';
import { BasesComponent } from './BasesComponent/bases.component';
import { InksComponent } from './InksComponent/inks.component';
import { PresentationComponent } from './PaintsComponent/PaintComponent/presentation.component';

const routes: Routes = [
  {path: '', component: AdminComponent, children: [
    {path: 'lines', component: LinesComponent},
    {path: 'paints', component: PaintsComponent},
    {path: 'bases', component: BasesComponent},
    {path: 'paints/:paintId', component: PaintComponent},
    {path: 'products', component: ProductsComponent},
    {path: 'users', component: UsersComponent},
    { path: 'inks', component: InksComponent}
  ]}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    SharedModule,
    ClarityModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    LinesComponent,
    AdminComponent,
    PaintsComponent,
    BasesComponent,
    ProductsComponent,
    UsersComponent,
    InksComponent,
    PaintComponent
  ],
  providers: [
    ProductService
  ]
})

export class AdminModule {}
