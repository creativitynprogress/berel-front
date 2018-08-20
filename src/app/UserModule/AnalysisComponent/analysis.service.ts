import { Injectable } from "@angular/core";
import { SubsidiaryService } from "../_services/subsidiary.service";
import { Observable } from "rxjs/Rx";
import { PurchaseService } from "../_services/purchase.service";

@Injectable()
export class AnalysisService {
  constructor(
    private subsidiaryService: SubsidiaryService,
    private purchaseService: PurchaseService
  ) {}

  get_results(subsidiaryId, params = {}): Observable<any> {
    const incomes$ = this.subsidiaryService.incomes_by_date(subsidiaryId, params);
    const pb$ = this.purchaseService.purchase_list(subsidiaryId, params);

    return Observable.zip(
      incomes$,
      pb$,
      (
        incomes: any[],
        purchases: any[],
      ) => ({ incomes, purchases })
    );
  }
}
