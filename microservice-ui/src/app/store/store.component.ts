import { Component, OnInit, Inject } from "@angular/core";
import { ProductRepository } from '../model/product.repository';
import { Product } from '../model/product.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';
import { Offer } from '../model/offer.model';
import { RestService } from '../rest.service';
import { Router } from '@angular/router';

// Build the API base from the current host so it works on EC2 (and locally)
// Example result on EC2: http://<EC2_PUBLIC_IP>:8000
const GATEWAY_PORT = 8000;
const API_BASE = `${window.location.protocol}//${window.location.hostname}:${GATEWAY_PORT}`;
const PRODUCT_PATH = '/product-service/products';

@Component({
  selector: "store",
  templateUrl: "store.component.html",
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {

  // strongly type the products list
  products: Product[] = [];

  // full products URL (no hardcoded localhost)
  private productsUrl = `${API_BASE}${PRODUCT_PATH}`;

  constructor(
    private repository: ProductRepository,
    private http: HttpClient,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    console.log("product api call →", this.productsUrl);
    return this.http
      .get<Product[]>(this.productsUrl)
      .pipe(map(data => data))
      .subscribe(products => {
        this.products = products;
        console.log(this.products);
      });
  }

  openDiscountDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '400px',
      height: '300px',
    });

    dialogRef.afterClosed().subscribe((showSnackBar: boolean) => {
      if (showSnackBar) {
        const a = document.createElement('a');
        a.click();
        a.remove();
      }
    });
  }

  openPriceDialog() {
    const dialogRef = this.dialog.open(PriceDialog, {
      width: '400px',
      height: '300px',
    });

    dialogRef.afterClosed().subscribe((showSnackBar: boolean) => {
      if (showSnackBar) {
        const a = document.createElement('a');
        a.click();
        a.remove();
      }
    });
  }

  openProductDialog() {
    const dialogRef = this.dialog.open(ProductDialog, {
      width: '400px',
      height: '420px'
    });

    dialogRef.afterClosed().subscribe((showSnackBar: boolean) => {
      if (showSnackBar) {
        const a = document.createElement('a');
        a.click();
        a.remove();
      }
    });
  }

  getProduct(id: number) {
    const url = `${this.productsUrl}/${id}`;
    console.log("product id ------------ " + id);
    console.log(url);
    return this.http
      .get<Product>(url)
      .pipe(map(data => data))
      .subscribe(product => {
        console.log('Fetched product:', product);
      });
  }
}

@Component({
  selector: 'confirmation-dialog',
  templateUrl: 'discount.component.html',
})
export class ConfirmationDialog {

  offer: Offer = new Offer();

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public product: Product,
    private http: HttpClient,
    public rest: RestService,
    private router: Router
  ) { }

  onNoClick() {
    console.log("cancel clicked");
    this.dialogRef.close();
  }

  addDiscount(form: NgForm) {
    console.log("save offer");
    console.log(this.offer.productId);
    this.rest.addDiscount(this.offer).subscribe(() => {
      console.log("Discount added successfully");
      window.location.reload();
      // this.router.navigate(['/store']);
    }, (err) => {
      console.log(err);
    });
    this.dialogRef.close(true);
  }
}

@Component({
  selector: 'price-dialog',
  templateUrl: 'price.component.html',
})
export class PriceDialog {

  product: Product = new Product();

  constructor(
    public dialogRef: MatDialogRef<PriceDialog>,
    @Inject(MAT_DIALOG_DATA) public productMatData: Product,
    private http: HttpClient,
    public rest: RestService,
    private router: Router
  ) { }

  onNoClick(): void {
    console.log("cancel clicked");
    this.dialogRef.close(true);
  }

  addPrice(form: NgForm) {
    console.log("save price");
    console.log(this.product.id);
    this.rest.addPrice(this.product).subscribe(() => {
      console.log("Price added successfully");
      window.location.reload();
    }, (err) => {
      console.log(err);
    });
    this.dialogRef.close(true);
  }
}

@Component({
  selector: 'product-dialog',
  templateUrl: 'product.component.html',
})
export class ProductDialog {
  baseUrl: string;
  product: Product = new Product();

  constructor(
    public dialogRef: MatDialogRef<ProductDialog>,
    @Inject(MAT_DIALOG_DATA) public productMatData: Product,
    private http: HttpClient,
    public rest: RestService,
    private router: Router
  ) { }

  onNoClick(): void {
    console.log("cancel clicked");
    this.dialogRef.close();
  }

  addNewProduct(form: NgForm) {
    console.log("adding new product");
    console.log(this.product);
    this.rest.saveProduct(this.product).subscribe(() => {
      console.log("product added successfully");
      window.location.reload();
      // this.router.navigate(['/store']);
    }, (err) => {
      console.log(err);
    });
    this.dialogRef.close(true);
  }
}

