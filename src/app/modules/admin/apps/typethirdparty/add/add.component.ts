import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { fuseAnimations } from '../../../../../../@fuse/animations';
import { environment } from '../../../../../../environments/environment';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { TypeThirdParty } from '../../../../../shared/models/third-party-type';
import { TypeThirdPartyService } from '../../../../../shared/services/typethirdparty.service';
import { listThirdPartyTypeNature } from '../../../../../shared/enums/thirdPartyTypeNature';

@Component({
  selector: 'app-add-project',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddComponent implements OnInit {
  isLoading: boolean;
  tableItem = [1];
  newTypeThirdParty = new TypeThirdParty();
  typethirdparty: TypeThirdParty[] = [
    {
      code: '',
      label: '',
      nature: '',
      suffix: null,
      length: null,
    },
  ];
  url = `${environment.services.i18n.url}/assets/`;
  filteredList = [];
  listNature = listThirdPartyTypeNature;
  constructor(
    private typeThirdPartyService: TypeThirdPartyService,
    private _router: Router,
    private snackBarService: SnackBarService,
    private _fuseConfirmationService: FuseConfirmationService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.set('home/thirdpartytype/add', 'Add');
  }
  createTypeThirdParty(myForm: NgForm) {
    if (myForm.valid) {
      this.typeThirdPartyService.createTypeThirdParty(this.typethirdparty).subscribe(
        () => {
          this._router.navigate([`../`], { relativeTo: this.route });
        },
        () => {},
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
  deleteRow(index, event) {
    event.stopPropagation();
    this.tableItem.splice(index, 1);
    this.typethirdparty.splice(index, 1);
    this.filteredList.splice(index, 1);
  }
  addRow(event) {
    event.stopPropagation();
    this.tableItem.push(1);
    this.typethirdparty.push({
      code: '',
      label: '',
      nature: '',
      suffix: '',
      length: null,
    });
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
