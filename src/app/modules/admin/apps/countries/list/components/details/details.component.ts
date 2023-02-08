import { Component, OnInit } from '@angular/core';

import { environment } from '../../../../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../../../../shared/services/snack-bar.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FuseConfirmationService } from '../../../../../../../../@fuse/services/confirmation';
import { Country } from '../../../../../../../shared/models/country';
import { TranslocoHttpLoader } from '../../../../../../../transloco/transloco-root.module';
import { CountryService } from '../../../../../../../shared/services/country.service';
import { City } from '../../../../../../../shared/models/city';
import { FeatureCodes } from '../../../../../../../shared/enums/feature-codes';
import { FeatureActions } from '../../../../../../../shared/enums/feature-actions';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  isLoading: boolean;
  country = new Country();
  cities: City[];
  url = `${environment.services.i18n.url}/assets/`;
  id: string;
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
  deleteCountry() {
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
        this.countryService.deleteCountry(this.country._id).subscribe(() => {
          this._router.navigate(['/home/countries']);
        });
      }
    });
  }
  addCountry() {
    this._router.navigate(['/home/countries/add']);
  }
  editCountry() {
    this._router.navigate([`/home/countries/${this.country._id}/edit`]);
  }
}
