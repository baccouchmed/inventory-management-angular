import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { fuseAnimations } from '../../../../../../@fuse/animations';
import { TranslocoHttpLoader } from '../../../../../transloco/transloco-root.module';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FeatureCodes } from '../../../../../shared/enums/feature-codes';
import { FeatureActions } from '../../../../../shared/enums/feature-actions';
import { TypeProduct } from '../../../../../shared/models/inventory';
import { CompanyProductService } from '../../../../../shared/services/company-product.service';

@Component({
  selector: 'app-details',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations,
})
export class AddComponent implements OnInit {
  stage = [new TypeProduct()];
  loading = false;
  isLoading: any;
  tableItem = [1];
  featureCodes = FeatureCodes;
  featureActions = FeatureActions;

  constructor(
    private translocoHttpLoader: TranslocoHttpLoader,
    private companyProductService: CompanyProductService,
    private _router: Router,
    private snackBarService: SnackBarService,
    private _fuseConfirmationService: FuseConfirmationService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.set('home/typesproducts/add', 'Add');
  }

  createStage(myForm: NgForm): void {
    if (myForm.valid) {
      this.companyProductService.createTypeProduct(this.stage).subscribe(() => {
        this._router.navigate([`../`], { relativeTo: this.route });
      });
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
          this.tableItem = [1];
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
  addRow(event): void {
    event.stopPropagation();
    this.tableItem.push(1);
    this.stage.push({
      label: '',
    });
  }
  deleteRow(index, event) {
    event.stopPropagation();
    this.tableItem.splice(index, 1);
    this.stage.splice(index, 1);
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
