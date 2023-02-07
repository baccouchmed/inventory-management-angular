import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { fuseAnimations } from '../../../../../../@fuse/animations';
import { TranslocoHttpLoader } from '../../../../../transloco/transloco-root.module';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ThirdParty } from '../../../../../shared/models/third-party';
import { TypeThirdPartyService } from '../../../../../shared/services/typethirdparty.service';
import { TypeThirdParty } from '../../../../../shared/models/third-party-type';
import { ThirdPartyService } from '../../../../../shared/services/thirdparty.service';
import { listNatures, Natures } from '../../../../../shared/enums/natures';
import { listTypeIdentifiers, Identifiers } from '../../../../../shared/enums/identifiers';
import { listGenders, Genders } from '../../../../../shared/enums/genders';
import { CompanyService } from '../../../../../shared/services/company.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-details',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations,
})
export class AddComponent implements OnInit {
  thirdParty = new ThirdParty();
  loading = false;
  listTypes: TypeThirdParty[];
  filteredListTypes = [];
  isLoading: any;
  listNatures = listNatures;
  readonly Natures = Natures;
  listTypeIdentifier = listTypeIdentifiers;
  readonly Identifiers = Identifiers;
  listGenders = listGenders;
  readonly Genders = Genders;
  filteredList = [];
  companyId: string;
  constructor(
    private translocoHttpLoader: TranslocoHttpLoader,
    private _router: Router,
    private snackBarService: SnackBarService,
    private _fuseConfirmationService: FuseConfirmationService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private typeThirdPartyService: TypeThirdPartyService,
    private thirdPartyService: ThirdPartyService,
    private companyService: CompanyService,
    private _matDialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.set('home/thirdparty/add', 'Add');
    this.typeThirdPartyService.getAllTypeThirdParty().subscribe(
      (types) => {
        this.listTypes = types;
        this.filteredListTypes = this.listTypes;
      },
      () => {},
    );
  }
  createThirdParty(myForm: NgForm): void {
    if (myForm.valid) {
      this.thirdPartyService
        .createThirdParty(this.thirdParty)
        .subscribe((thirdParty) => {
          this.thirdParty = thirdParty;
          this._router.navigate([`../${thirdParty._id}`], { relativeTo: this.route });
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

  codeFormat() {
    this.thirdPartyService.getCode(this.thirdParty?.thirdPartyTypeId?._id).subscribe(
      (code) => {
        this.thirdParty.code = code;
      },
      () => {},
    );
  }
}
