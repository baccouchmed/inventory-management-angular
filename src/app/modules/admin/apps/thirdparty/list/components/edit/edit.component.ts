import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../../../../../shared/services/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../../../../shared/services/snack-bar.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FuseConfirmationService } from '../../../../../../../../@fuse/services/confirmation';
import { Company } from '../../../../../../../shared/models/company';
import { environment } from '../../../../../../../../environments/environment';
import { NgForm } from '@angular/forms';
import { ThirdPartyService } from '../../../../../../../shared/services/thirdparty.service';
import { ThirdParty } from '../../../../../../../shared/models/third-party';
import { listNatures, Natures } from '../../../../../../../shared/enums/natures';
import { listTypeIdentifiers, Identifiers } from '../../../../../../../shared/enums/identifiers';
import { listGenders, Genders } from '../../../../../../../shared/enums/genders';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  id: string;
  company = new Company();
  thirdParty = new ThirdParty();
  url = `${environment.services.i18n.url}/assets/`;
  isLoading: any;
  filteredList = [];
  listNatures = listNatures;
  readonly Natures = Natures;
  listTypeIdentifier = listTypeIdentifiers;
  readonly Identifiers = Identifiers;
  listGenders = listGenders;
  readonly Genders = Genders;
  indexContact: number;
  companyId: string;
  length: number;
  isPristine = false;
  constructor(
    private thirdPartyService: ThirdPartyService,
    private companyService: CompanyService,
    private _router: Router,
    private snackBarService: SnackBarService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private _fuseConfirmationService: FuseConfirmationService,
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.thirdPartyService.getOneThirdParty(this.id).subscribe(
          (thirdParty) => {
            this.thirdParty = { ...this.thirdParty, ...thirdParty };
            this.breadcrumbService.set('home/thirdparty/:id', this.thirdParty.label);
          },
          () => {},
        );
      }
    });
  }
  deleteThirdParty() {
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
        this.thirdPartyService.deleteThirdParty(this.thirdParty._id).subscribe(() => {
          this._router.navigate(['/home/thirdparty']);
        });
      }
    });
  }
  cancelEdit() {
    if (!this.isPristine) {
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
  updateThirdParty(myForm: NgForm) {
    if (myForm.valid) {
      this.thirdPartyService
        .updateThirdParty(
          this.thirdParty,
        )
        .subscribe(() => {
          this._router.navigate(['../'], { relativeTo: this.route });
        });
    }
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
