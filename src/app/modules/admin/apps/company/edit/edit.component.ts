import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../../../shared/services/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { Company } from '../../../../../shared/models/company';
import { environment } from '../../../../../../environments/environment';
import { NgForm } from '@angular/forms';
import { Country, Governorate, Municipality } from '../../../../../shared/models/country';
import { CountryService } from '../../../../../shared/services/country.service';
import { UserService } from '../../../../../shared/services/user.service';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  company = new Company();
  url = `${environment.services.i18n.url}/assets/`;
  isLoading: any;
  urlLogo = `${environment.api}/public/logo/`;
  logo: File = null;
  image: string;
  imageSrc: string | ArrayBuffer;
  logoExist = false;
  loadingLogo: boolean;
  listCountries: Country[];
  filteredListCountries = [];
  listGovernorates: Governorate[];
  filteredListGovernorates = [];
  listMunicipalities: Municipality[];
  filteredListMunicipalities = [];
  constructor(
    private companyService: CompanyService,
    private _router: Router,
    private snackBarService: SnackBarService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private _fuseConfirmationService: FuseConfirmationService,
    private countryService: CountryService,
    private userService: UserService,
  ) {}
  ngOnInit(): void {
    this.companyService.getCompany(this.userService._user.getValue().companyId._id).subscribe(
      (company) => {
        this.company = { ...this.company, ...company };
        if (this.company.logo) {
          this.logoExist = true;
        }
        this.getCountries();
        this.breadcrumbService.set('home/companies/:id', this.company.name);
      },
      () => {},
    );
  }
  getCountries() {
    this.countryService.getAllCountries().subscribe(
      (countries) => {
        this.listCountries = countries;
        this.filteredListCountries = this.listCountries;

        if (this.company.countryId) {
          this.company.countryId = this.listCountries.find(
            (c) => c._id === this.company.countryId._id,
          );
          this.countryService.getGovernorates(this.company.countryId._id).subscribe(
            (governorates) => {
              this.listGovernorates = governorates;
              this.filteredListGovernorates = this.listGovernorates;
              if (this.company.governorateId) {
                this.company.governorateId = this.listGovernorates.find(
                  (c) => c._id === this.company.governorateId._id,
                );
              }
              this.countryService.getMunicipalities(this.company.governorateId._id).subscribe(
                (municipalities) => {
                  this.listMunicipalities = municipalities;
                  this.filteredListMunicipalities = this.listMunicipalities;
                  if (this.company.municipalityId) {
                    this.company.municipalityId = this.listMunicipalities.find(
                      (c) => c._id === this.company.municipalityId._id,
                    );
                  }
                },
                () => {},
              );
            },
            () => {},
          );
        }
      },
      () => {},
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
        this.companyService.deleteCompany(this.company._id).subscribe(() => {
          this._router.navigate(['']);
        });
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
      this.companyService.updateCompany(this.company).subscribe(() => {
        this._router.navigate(['../'], { relativeTo: this.route });
      });
    }
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
  onLogoSelected(event: Event): void {
    if (event.target['files'] && event.target['files'].length > 0) {
      [this.logo] = event.target['files'];
      this.sendLogo();
    }
  }
  sendLogo(): void {
    const data: FormData = new FormData();
    data.append(`logo`, this.logo, this.logo.name);
    this.loadingLogo = true;
    this.companyService.updateLogo(data, this.company._id).subscribe(
      (company: Company) => {
        this.company.logo = company.logo;
        this.loadingLogo = false;
      },
      () => {
        this.loadingLogo = false;
      },
    );
  }
  refreshListCountry(value: any) {
    if (this.company.countryId !== null) {
      this.company.countryId = value;
      this.company.governorateId = null;
      this.company.municipalityId = null;
      this.countryService.getGovernorates(value._id).subscribe(
        (governorates) => {
          this.listGovernorates = governorates;
          this.filteredListGovernorates = this.listGovernorates;
        },
        () => {},
      );
    } else {
      this.company.governorateId = null;
      this.filteredListGovernorates = [];
      this.company.municipalityId = null;
      this.filteredListMunicipalities = [];
    }
  }
  refreshListGovernorate(value: any) {
    if (this.company.governorateId !== null) {
      this.company.governorateId = value;
      this.company.municipalityId = null;
      this.countryService.getMunicipalities(value._id).subscribe(
        (municipalities) => {
          this.listMunicipalities = municipalities;
          this.filteredListMunicipalities = this.listMunicipalities;
        },
        () => {},
      );
    } else {
      this.company.municipalityId = null;
      this.filteredListMunicipalities = [];
    }
  }
  refreshListMunicipality(value: any) {
    if (this.company.municipalityId) {
      this.company.municipalityId = value;
    }
  }
}
