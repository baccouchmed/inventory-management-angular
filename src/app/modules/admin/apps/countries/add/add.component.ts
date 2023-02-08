import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Country } from '../../../../../shared/models/country';
import { fuseAnimations } from '../../../../../../@fuse/animations';
import { environment } from '../../../../../../environments/environment';
import { TranslocoHttpLoader } from '../../../../../transloco/transloco-root.module';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { BreadcrumbService } from 'xng-breadcrumb';
import { CountryService } from 'app/shared/services/country.service';
import { City } from '../../../../../shared/models/city';
import { FeatureCodes } from '../../../../../shared/enums/feature-codes';
import { FeatureActions } from '../../../../../shared/enums/feature-actions';
import { Delegation } from '../../../../../shared/models/delegation';

@Component({
  selector: 'app-details',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations,
})
export class AddComponent implements OnInit {
  url = `${environment.services.i18n.url}/assets/`;
  country = new Country();
  loading: boolean;
  filteredListCountries: any;
  cities: City[][] = [
    [
      {
        code: '',
        cityName: '',
        countryId: null,
      },
    ],
  ];
  delegations: Delegation[] = [
    {
      code: '',
      delegationName: '',
      countryId: null,
    },
  ];
  featureCodes = FeatureCodes;
  featureActions = FeatureActions;
  selectedDelegation: Delegation;

  constructor(
    private translocoHttpLoader: TranslocoHttpLoader,
    private countryService: CountryService,
    private _router: Router,
    private snackBarService: SnackBarService,
    private _fuseConfirmationService: FuseConfirmationService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.set('home/countries/add', 'Add');
  }

  createCountry(myForm: NgForm): void {
    if (myForm.valid) {
      this.loading = true;
      this.countryService.createCountry(this.country, this.delegations, this.cities).subscribe(
        (company) => {
          this._router.navigate([`../${company._id}`], { relativeTo: this.route });
          this.loading = false;
        },
        () => {
          this.loading = false;
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
          this.cities = [
            [
              {
                code: '',
                cityName: '',
                countryId: null,
              },
            ],
          ];
          this.delegations = [
            {
              code: '',
              delegationName: '',
              countryId: null,
            },
          ];
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
    this.cities.push([
      {
        code: '',
        cityName: '',
        countryId: null,
        delegationId: null,
      },
    ]);
    this.delegations.push({
      code: '',
      delegationName: '',
      countryId: null,
    });
  }
  deleteRow(index, event) {
    event.stopPropagation();
    this.delegations.splice(index, 1);
    this.cities.splice(index, 1);
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

  openDetails(delegation, event) {
    event.stopPropagation();
    this.selectedDelegation = delegation;
  }
  closeDetails() {
    this.selectedDelegation = null;
  }
  deleteCityRow(index, index1, event: MouseEvent) {
    event.stopPropagation();
    if (this.cities[index].length > 1) {
      this.cities[index].splice(index1, 1);
    }
  }
  addCityRow(index, index1, event: MouseEvent) {
    event.stopPropagation();
    this.cities[index].push(new City());
  }
}
