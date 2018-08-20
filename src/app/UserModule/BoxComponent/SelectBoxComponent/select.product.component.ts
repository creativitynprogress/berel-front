import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { CompleterService, CompleterData } from "ng2-completer";
import { ProductService } from "../../_services/product.service";
import { ActivatedRoute } from "@angular/router";
import { ProductShared } from "../../_shared.ts/product.shared";

@Component({
  templateUrl: "./select.product.component.html",
  selector: "select-product"
})
export class SelectProductComponent implements OnInit {
  @Output() save = new EventEmitter<any>();

  public searchStr: string;
  public dataService: CompleterData;

  public subsidiaryId: string;
  public products: any[] = [];
  public product_selected: any;
  public quantity: number = 1;

  constructor(
    private completerService: CompleterService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private productShared: ProductShared
  ) {}

  ngOnInit() {
    this.route.parent.parent.params.subscribe(
      params => (this.subsidiaryId = params["id"])
    );

    this.dataService = this.completerService.local(
      this.productService.products_list(this.subsidiaryId),
      "product_id,bar_code,description",
      "product_id,bar_code,description"
    );
  }

  emitClose() {
    this.products = [];
    this.quantity = 1;
  }

  selectProduct(select) {
    this.product_selected = select.originalObject;
  }

  addProduct() {
    const productItem = {
      product_id: this.product_selected.product_id,
      po: this.product_selected.po,
      sp: this.product_selected.sp,
      unit: this.product_selected.unit,
      quantity: this.quantity,
      bar_code: this.product_selected.bar_code,
      description: this.product_selected.description,
      brand: this.product_selected.brand,
      price: this.product_selected.salePrice
        ? this.product_selected.salePrice * this.quantity
        : this.product_selected.suggestedPrice * this.quantity
    };

    this.productShared.add_product(productItem);
    this.product_selected = null;
    this.quantity = 1;
  }

  removeItem(product) {
    this.products = this.products.filter(p => p.product_id !== product.product_id)
  }

  saveProducts() {
    this.save.emit(this.products);
    this.emitClose();
  }
}
