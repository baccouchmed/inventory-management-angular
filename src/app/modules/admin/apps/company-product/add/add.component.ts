import { Component, OnInit } from '@angular/core';
import { ParamProjectService } from '../../../../../shared/services/param-project.service';
import { ThirdPartyService } from '../../../../../shared/services/thirdparty.service';
import { NgForm } from '@angular/forms';
import { UserService } from '../../../../../shared/services/user.service';
import { TranslocoService } from '@ngneat/transloco';
import { DateAdapter } from '@angular/material/core';
import { FeatureCodes } from '../../../../../shared/enums/feature-codes';
import { FeatureActions } from '../../../../../shared/enums/feature-actions';
import * as moment from 'moment';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyProduct, Product, TypeProduct } from '../../../../../shared/models/inventory';
import { CompanyProductService } from 'app/shared/services/company-product.service';
import { InventoryService } from '../../../../../shared/services/inventory.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  isLoading: boolean;
  loadingSave: boolean;
  isScreenSmall: boolean;
  minDate: string;
  filteredList = [];
  featureCodes = FeatureCodes;
  featureActions = FeatureActions;
  contractPrices: any;
  // new ********************
  typeProducts: TypeProduct[] = [new TypeProduct()];
  selectedTypeProduct: TypeProduct | null = null;
  products: Product[][] = [[new Product()]];

  logo: File = null;
  image: string;
  imageSrc: string | ArrayBuffer;
  logoExist = false;
  // *******************
  listTypeProduct: TypeProduct[];
  filteredListTypeProduct = [];
  company: CompanyProduct = new CompanyProduct();
  constructor(
    private paramProjectService: ParamProjectService,
    private inventoryService: InventoryService,
    private companyProductService: CompanyProductService,
    private breadcrumbService: BreadcrumbService,
    private thirdPartyService: ThirdPartyService,
    private userService: UserService,
    private translocoService: TranslocoService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _router: Router,
    private route: ActivatedRoute,
    private _adapter: DateAdapter<any>,
  ) {}

  ngOnInit(): void {
    this.companyProductService.getAllTypeProducts().subscribe((typeProducts) => {
      this.listTypeProduct = typeProducts;
    });
    this.translocoService.langChanges$.subscribe((lang) => {
      moment.locale(lang);
      this._adapter.setLocale(moment.locale(lang));
    });
    this.breadcrumbService.set('home/inventory/add', 'Add');
    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$.subscribe(({ matchingAliases }) => {
      // Check if the screen is small
      this.isScreenSmall = !matchingAliases.includes('sm');
    });
    this.minDate = moment().format().toString();
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
  resetForm(myForm: NgForm, event) {
    event.stopPropagation();
    if (myForm.pristine) {
      myForm.resetForm();
    } else {
      // Open the confirmation dialog
      const confirmation = this._fuseConfirmationService.open({
        title: 'Clear',
        message: 'Would you like to clear the information ?',
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
          myForm.resetForm();
        }
      });
    }
  }
  cancelForm(myForm: NgForm) {
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
  createCompany(myForm: any) {
    if (myForm.valid) {
      const data: FormData = new FormData();
      if (this.logo) {
        data.append(`logo`, this.logo, this.logo.name);
      }
      this.companyProductService
        .createCompany(this.company, this.typeProducts, this.products)
        .subscribe((company) => {
          if (this.logo) {
            this.sendLogo(company._id);
          }
          this._router.navigate([`../${company._id}`], { relativeTo: this.route });
        });
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
}
