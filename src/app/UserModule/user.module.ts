import { NgModule } from '@angular/core';
import { ClarityModule } from "@clr/angular";
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { Ng2CompleterModule } from 'ng2-completer';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { SubsidiariesComponent } from './SubsidiariesComponent/subsidiaries.component';
import { DashboardComponent } from './dashboard.component';
import { PaintsPriceComponent } from './PaintsPriceComponent/paints.price.component';
import { BoxComponent } from './BoxComponent/box.component';
import { SubsidiaryComponent } from './SubsidiaryComponent/subsidiary.component';
import { ProductsPriceComponent } from './ProductsPriceComponent/products.price.component';
import { SharedModule } from '../SharedModule/shared.module';
import { ToolsService } from './_services/tools.service';
import { PaintPriceService } from './_services/paint.price.service';
import { ProductService } from './_services/product.service';
import { SubsidiaryService } from './_services/subsidiary.service';
import { TicketItemComponent } from './BoxComponent/ticket.item.component';
import { LinesPriceComponent } from './LinesPriceComponent/lines.price.component';
import { SubsidiaryRangeService } from './_services/subsidiary.range.service';
import { PresentationsDetails } from './PaintsPriceComponent/PresentationsComponent/presentations.component';
import { SelectPaintComponent } from './BoxComponent/SelectPaintComponent/select.paint.component';
import { SelectProductComponent } from './BoxComponent/SelectBoxComponent/select.product.component';
import { TicketService } from './_services/ticket.service';
import { BoxcutComponent } from './SalesComponent/BoxcutComponent/boxcut.component';
import { BaseSubsidiaryComponent } from './BaseSubsidiaryComponent/base.subsidiary.component';
import { ClientsComponent } from './ClientsComponent/clients.component';
import { UserService } from './_services/user.service';
import { CardsComponent } from './CardsComponent/cards.component';
import { PaysComponent } from './BoxComponent/PaysComponent/pays.component';
import { TicketsComponent } from './BoxComponent/TicketsComponent/tickets.component';
import { MenuComponent } from './BoxComponent/MenuComponent/menu.component';
import { PaintShared } from './_shared.ts/paint.shared';
import { ProductShared } from './_shared.ts/product.shared';
import { PaintsOwnerComponent } from './PaintsOwnerComponent/paints.owner.component';
import { ClientShared } from './_shared.ts/client.shared';
import { SelectClientComponent } from './BoxComponent/SelectClientComponent/select.client.component';
import { TicketShared } from './_shared.ts/ticket.shared';
import { PurchasesComponent } from './PurchasesComponent/purchases.component';
import { PurchaseComponent } from './PurchasesComponent/PurchaseComponent/purchase.component';
import { ChartsModule } from 'ng2-charts';
import { AnalysisComponent } from './AnalysisComponent/analysis.component';
import { HistoryClientComponent } from './ClientsComponent/HistoryClientComponent/history.client.component';
import { TicketDetailsComponent } from './ClientsComponent/HistoryClientComponent/ticket.details.component';
import { ProvidersComponent} from './ProvidersComponent/providers.component';
import { InvoiceComponent } from './InvoiceComponent/invoice.component';
import { InkSubsidiaryComponent } from './InkSubsidiaryComponent/inksubsidiary.component';
import { EmployeeComponent } from './EmployeeComponent/employee.component';
import { BoxcutSalesComponent } from './SalesComponent/BoxcutSalesComponent/boxcut.sales.component';
import { TicketSalesComponent } from './SalesComponent/TicketSalesComponent/ticket.sales.component';
import { AnalysisService } from './AnalysisComponent/analysis.service';
import { AnalysisHomeComponent } from './AnalysisComponent/analysis.home.component';
import { PurchaseAnalysisComponent } from './AnalysisComponent/PurchaseAnalysisComponent/purchase.analysis.component';
import { PurchaseService } from './_services/purchase.service';
import { PaintOwnerComponent } from './PaintsOwnerComponent/PaintOwnerComponent/paint.owner.component';
import { InfoComponent } from './InfoComponent/info.component';

const routes: Routes = [
  {path: '', component: DashboardComponent, children: [
    {path: '', redirectTo: 'subsidiaries', pathMatch: 'full'},
    {path: 'subsidiaries', component: SubsidiariesComponent },
    {path: 'subsidiary/:id', component: SubsidiaryComponent, children: [
      { path: '', redirectTo: 'lines', pathMatch: 'full'},
      { path: 'lines', component: LinesPriceComponent },
      { path: 'paints', component: PaintsPriceComponent },
      { path: 'products', component: ProductsPriceComponent },
      { path: 'purchases', component: PurchasesComponent },
      { path: 'purchases/create', component: PurchaseComponent },
      { path: 'info', component: InfoComponent },
      { path: 'sales', component: BoxcutSalesComponent},
      { path: 'employees', component: EmployeeComponent},
      { path: 'invoices', component: InvoiceComponent},
      { path: 'bases', component: BaseSubsidiaryComponent},
      { path: 'inks', component: InkSubsidiaryComponent},
      { path: 'box', component: BoxComponent, children: [
        {path: '', component: MenuComponent},
        {path: 'paints_berel', component: SelectPaintComponent},
        {path: 'products', component: SelectProductComponent},
        {path: 'tickets', component: TicketsComponent},
        {path: 'clients', component: SelectClientComponent}
      ] },
      { path: 'analysis', component: AnalysisHomeComponent, children: [
        { path: '', redirectTo: 'graph', pathMatch: 'full'},
        { path: 'graph', component: AnalysisComponent },
        { path: 'sales', component: TicketSalesComponent },
        { path: 'purchases', component: PurchaseAnalysisComponent }
      ]}
    ]},
    {path: 'clients', component: ClientsComponent},
    {path: 'clients/:clientId', component: HistoryClientComponent},
    { path: 'cards', component: CardsComponent },
    { path: 'paints', component: PaintsOwnerComponent},
    { path: 'paint/:paintId', component: PaintOwnerComponent },
    { path: 'providers', component: ProvidersComponent }
  ]}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    SharedModule,
    Ng2CompleterModule,
    ClarityModule,
    ChartsModule,
    MyDateRangePickerModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    DashboardComponent,
    SubsidiariesComponent,
    SubsidiaryComponent,
    LinesPriceComponent,
    PaintsPriceComponent,
    BoxComponent,
    ProductsPriceComponent,
    InvoiceComponent,
    TicketItemComponent,
    PresentationsDetails,
    SelectPaintComponent,
    SelectProductComponent,
    SelectClientComponent,
    BoxcutComponent,
    BaseSubsidiaryComponent,
    ClientsComponent,
    CardsComponent,
    PaysComponent,
    TicketsComponent,
    MenuComponent,
    PaintsOwnerComponent,
    PurchasesComponent,
    PurchaseComponent,
    AnalysisHomeComponent,
    AnalysisComponent,
    PurchaseAnalysisComponent,
    HistoryClientComponent,
    TicketDetailsComponent,
    ProvidersComponent,
    InkSubsidiaryComponent,
    EmployeeComponent,
    BoxcutSalesComponent,
    TicketSalesComponent,
    PaintOwnerComponent,
    InfoComponent
  ],
  providers: [
    ToolsService,
    PaintPriceService,
    ProductService,
    PurchaseService,
    SubsidiaryService,
    SubsidiaryRangeService,
    TicketService,
    UserService,
    PaintShared,
    ProductShared,
    ClientShared,
    TicketShared,
    AnalysisService,
    DatePipe
  ]
})

export class UserModule {}
