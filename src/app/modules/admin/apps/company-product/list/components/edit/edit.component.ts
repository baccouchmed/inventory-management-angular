import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../../../../shared/services/snack-bar.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FuseConfirmationService } from '../../../../../../../../@fuse/services/confirmation';
import { NgForm } from '@angular/forms';
import {
  Category,
  CompanyProduct,
  Product,
  Subcategory,
  TypeProduct,
} from '../../../../../../../shared/models/inventory';
import { ThirdParty } from '../../../../../../../shared/models/third-party';
import { listSubcategoryFood } from '../../../../../../../shared/enums/subcategoryFood';
import { FeatureCodes } from '../../../../../../../shared/enums/feature-codes';
import { FeatureActions } from '../../../../../../../shared/enums/feature-actions';
import { InventoryService } from '../../../../../../../shared/services/inventory.service';
import { forkJoin } from 'rxjs';
import { CompanyProductService } from '../../../../../../../shared/services/company-product.service';
import { environment } from '../../../../../../../../environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  isLoading: boolean;
  loadingSave: boolean;
  isScreenSmall: boolean;
  minDate: string;
  filteredListSite = [];
  filteredList = [];
  originListCities = [];
  filteredListCities = [];
  filteredListTypePrices = [[]];
  listTransporters: ThirdParty[];
  filteredListTransporters = [];
  siteIds: string[] = [];
  featureCodes = FeatureCodes;
  featureActions = FeatureActions;
  contractLines: any;
  contractPrices: any;
  // new ********************
  category: Category;
  subcategories: Subcategory[] = [new Subcategory()];
  selectedSubcategory: Subcategory | null = null;
  products: Product[][] = [[new Product()]];
  urlLogo = `${environment.api}/public/logo/`;

  logo: File = null;
  image: string;
  imageSrc: string | ArrayBuffer;
  logoExist = false;
  // *******************
  listCompanies: CompanyProduct[];
  listCompanyProduct: CompanyProduct[];
  filteredListCompanyProduct = [];
  listTypeProduct: TypeProduct[];
  filteredListTypeProduct = [];
  readonly listSubcategoryFood = listSubcategoryFood;
  id: string;
  typeProducts: any;
  selectedTypeProduct: Boolean;
  company: CompanyProduct;
  constructor(
    private inventoryService: InventoryService,
    private _router: Router,
    private snackBarService: SnackBarService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private _fuseConfirmationService: FuseConfirmationService,
    private companyProductService: CompanyProductService,
  ) {}
  ngOnInit() {
    this.route.paramMap.subscribe(
      (param) => {
        this.id = param.get('id');
        if (this.id) {
          const obs = [
            this.companyProductService.getCompany(this.id),
            this.companyProductService.getCompanyTypeProduct(this.id),
            this.companyProductService.getAllTypeProducts(),
          ];
          this.isLoading = true;
          forkJoin(obs).subscribe(
            (result: [CompanyProduct, any, TypeProduct[]]) => {
              this.company = result[0];
              if (this.company.logo) {
                this.logoExist = true;
              }
              this.typeProducts = result[1].companyProductTypeProducts;
              this.products = result[1].products;
              this.isLoading = false;
              this.listTypeProduct = result[2];
              for (const [index, typeProduct] of this.typeProducts.entries()) {
                this.typeProducts[index] = this.listTypeProduct.find(
                  (c) => c._id === typeProduct._id,
                );
              }
            },
            () => {
              this.isLoading = false;
            },
          );
        }
      },
      () => {
        this.isLoading = false;
      },
    );
  }

  deleteCompany() {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete',
      message: 'Would you like to confirm the deletion ?',
      actions: {
        confirm: {
          label: 'yes',
        },
        cancel: {
          label: 'no',
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        /* this.companyProductService.deleteCompany(this.company._id).subscribe(() => {
          this._router.navigate(['']);
        });*/
      }
    });
  }
  cancelEdit(myForm: NgForm) {
    if (myForm.pristine) {
      this._router.navigate([`../`], { relativeTo: this.route });
    } else {
      // Open the confirmation dialog
      const confirmation = this._fuseConfirmationService.open({
        title: 'Cancel',
        message: 'Would you like to cancel the modification ?',
        actions: {
          confirm: {
            label: 'yes',
          },
          cancel: {
            label: 'no',
          },
        },
      });
      // Subscribe to the confirmation dialog closed action
      confirmation.afterClosed().subscribe((result) => {
        // If the confirm button pressed...
        if (result === 'confirmed') {
          this._router.navigate([`../`], { relativeTo: this.route });
        }
      });
    }
  }
  updateCompany(myForm: NgForm) {
    if (myForm.valid) {
      this.companyProductService
        .updateCompany(this.company, this.typeProducts, this.products)
        .subscribe(() => {
          this._router.navigate(['../'], { relativeTo: this.route });
        });
    }
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  openEdit(typeProduct, event) {
    event.stopPropagation();
    this.selectedTypeProduct = typeProduct;
  }
  closeDetails() {
    this.selectedTypeProduct = null;
  }
  deleteProductRow(index, index1, event: MouseEvent) {
    event.stopPropagation();
    if (this.products[index].length > 1) {
      this.products[index].splice(index1, 1);
    }
  }
  addProductRow(index, index1, event: MouseEvent) {
    event.stopPropagation();
    this.products[index].push(new Product());
    this.filteredListTypeProduct[index].push([]);
    console.log('addProductRow', this.filteredListTypeProduct);
  }
  refreshListTypeProduct(value: any, index, index1) {
    console.log(value, index, index1);
    if (value !== null) {
      this.products[index][index1].typeProductId = null;
      this.companyProductService.getCompanyTypeProduct(value._id).subscribe((d) => {
        this.listTypeProduct[index][index1] = d.map((val) => val.typeProductId);
        this.filteredListTypeProduct[index][index1] = this.listTypeProduct[index][index1];
        console.log(this.filteredListTypeProduct);
      });
    } else {
      this.products[index][index1].typeProductId = null;
      this.filteredListTypeProduct[index][index1] = [];
      console.log(this.filteredListTypeProduct);
    }
  }

  onLogoSelected(event: Event): void {
    event.stopPropagation();
    if (event.target['files'] && event.target['files'].length > 0) {
      [this.logo] = event.target['files'];
      const file = event.target['files'][0];
      const reader = new FileReader();
      reader.onload = () => (this.imageSrc = reader.result);
      reader.readAsDataURL(file);
      this.logoExist = true;
    }
  }
  sendLogo(id): void {
    const data: FormData = new FormData();
    data.append(`logo`, this.logo, this.logo.name);
    this.companyProductService.updateLogo(data, id).subscribe(
      (company) => {
        this.company = company;
      },
      () => {},
    );
  }
  deleteTypeProductRow(index, event: MouseEvent) {
    event.stopPropagation();
    if (this.typeProducts.length > 1) {
      this.typeProducts.splice(index, 1);
      this.products.splice(index, 1);
    }
  }
  addTypeProductRow(event: MouseEvent) {
    event.stopPropagation();
    this.typeProducts.push(new TypeProduct());
    this.products.push([new Product()]);
  }
  onProductLogoSelected(event: Event, product, index, index1): void {
    event.stopPropagation();
    if (event.target['files'] && event.target['files'].length > 0) {
      [this.logo] = event.target['files'];
      const file = event.target['files'][0];
      const reader = new FileReader();
      reader.onload = () => (this.imageSrc = reader.result);
      reader.readAsDataURL(file);
      this.sendProductLogo(product._id, index, index1);
    }
  }
  sendProductLogo(id, index, index1): void {
    const data: FormData = new FormData();
    data.append(`logo`, this.logo, this.logo.name);
    this.companyProductService.updateProductLogo(data, id).subscribe(
      (product) => {
        this.products[index][index1].logo = product.logo;
      },
      () => {},
    );
  }
}
