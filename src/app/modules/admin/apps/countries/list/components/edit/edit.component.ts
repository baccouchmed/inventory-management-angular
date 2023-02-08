import { Component, OnInit } from '@angular/core';

import { environment } from '../../../../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../../../../shared/services/snack-bar.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FuseConfirmationService } from '../../../../../../../../@fuse/services/confirmation';
import { NgForm } from '@angular/forms';
import { Country } from '../../../../../../../shared/models/country';
import { City } from '../../../../../../../shared/models/city';
import { TranslocoHttpLoader } from '../../../../../../../transloco/transloco-root.module';
import { CountryService } from '../../../../../../../shared/services/country.service';
import { FeatureCodes } from '../../../../../../../shared/enums/feature-codes';
import { FeatureActions } from '../../../../../../../shared/enums/feature-actions';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  id: string;
  url = `${environment.services.i18n.url}/assets/`;
  country = new Country();
  loading = false;
  isLoading: boolean;
  filteredListCountries: any;
  cities: City[];
  deletedCities = [];
  featureCodes = FeatureCodes;
  featureActions = FeatureActions;
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
    this.isLoading = true;
    this.route.paramMap.subscribe(
      (param) => {
        this.id = param.get('id');
        if (this.id) {
          this.countryService.getCountry(this.id).subscribe(
            (country) => {
              this.country = { ...this.country, ...country };
              this.countryService.getCities(this.country._id).subscribe(
                (cities) => {
                  this.cities = cities;
                  if (!this.cities.length) {
                    this.cities[0] = {
                      code: '',
                      cityName: '',
                      countryId: null,
                    };
                  } else {
                    this.cities[this.cities.length] = {
                      code: '',
                      cityName: '',
                      countryId: null,
                    };
                  }
                },
                () => {},
              );
              this.breadcrumbService.set('home/countries/:id', this.country.countryName);
              this.isLoading = false;
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
  updateCountry(myForm: NgForm): void {
    if (myForm.valid) {
      this.loading = true;

      this.countryService.updateCountry(this.country, this.cities, this.deletedCities).subscribe(
        () => {
          this._router.navigate(['../'], { relativeTo: this.route });
          this.loading = false;
        },
        () => {
          this.loading = false;
        },
      );
    }
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
  deleteCountry(country) {
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
        this.countryService.deleteCountry(country._id).subscribe(() => {
          this._router.navigate(['/home/countries']);
        });
      }
    });
  }
  addRow(event): void {
    event.stopPropagation();
    this.cities.push({
      code: '',
      cityName: '',
      countryId: null,
    });
  }
  deleteRow(index, event) {
    event.stopPropagation();
    if (this.cities[index]._id) {
      this.deletedCities.push(this.cities[index]._id);
    }
    this.cities.splice(index, 1);
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
