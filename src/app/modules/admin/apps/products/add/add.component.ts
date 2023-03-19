import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { fuseAnimations } from '../../../../../../@fuse/animations';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { BreadcrumbService } from 'xng-breadcrumb';
import { CompanyProduct, Product, TypeProduct } from '../../../../../shared/models/inventory';
import { CompanyProductService } from '../../../../../shared/services/company-product.service';
import { forkJoin } from 'rxjs';
import { InventoryService } from '../../../../../shared/services/inventory.service';

@Component({
  selector: 'app-details',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations,
})
export class AddComponent implements OnInit {
  isLoading: boolean;
  product: Product = new Product();
  listCompanyProduct: CompanyProduct[];
  filteredListCompanyProduct: CompanyProduct[];
  listTypeProduct: TypeProduct[];
  filteredListTypeProduct: TypeProduct[];
  newCompanyProduct: string;
  newTypeProduct: string;
  constructor(
    private breadcrumbService: BreadcrumbService,
    private _router: Router,
    private snackBarService: SnackBarService,
    private _fuseConfirmationService: FuseConfirmationService,
    private route: ActivatedRoute,
    private companyProductService: CompanyProductService,
    private inventoryService: InventoryService,
  ) {}

  ngOnInit(): void {
    this.product.companyProductId = null;
    this.product.typeProductId = null;
    this.breadcrumbService.set('home/users/add', 'Add');
    const obs = [
      this.companyProductService.getListCompanies(),
      this.companyProductService.getAllTypeProducts(),
    ];
    forkJoin(obs).subscribe(
      (result: [CompanyProduct[], TypeProduct[]]) => {
        this.listCompanyProduct = result[0];
        this.filteredListCompanyProduct = this.listCompanyProduct;
        this.listTypeProduct = result[1];
        this.filteredListTypeProduct = this.listTypeProduct;
      },
      () => {},
    );
  }
  createProduct(myForm: NgForm): void {
    if (myForm.valid) {
      this.isLoading = true;
      this.inventoryService.createProduct(this.product).subscribe(
        () => {
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        },
      );
    }
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

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
