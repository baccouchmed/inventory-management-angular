import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { fuseAnimations } from '../../../../../../@fuse/animations';
import { environment } from '../../../../../../environments/environment';
import { CompanyService } from '../../../../../shared/services/company.service';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { Company } from '../../../../../shared/models/company';
import { listTypeCompany } from '../../../../../shared/enums/types-company';
import { Country, Governorate, Municipality } from '../../../../../shared/models/country';
import { CountryService } from '../../../../../shared/services/country.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations,
})
export class AddComponent implements OnInit {
  isLoading: boolean;
  company = new Company();
  url = `${environment.services.i18n.url}/assets/`;
  logo: File = null;
  image: string;
  imageSrc: string | ArrayBuffer;
  logoExist = false;
  readonly listTypeCompany = listTypeCompany;
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
    private _fuseConfirmationService: FuseConfirmationService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private countryService: CountryService,
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.set('home/companies/add', 'Add');
    this.getCountries();
  }
  createCompany(myForm: NgForm) {
    if (myForm.valid) {
      const data: FormData = new FormData();
      if (this.logo) {
        data.append(`logo`, this.logo, this.logo.name);
      }
      this.companyService.createCompany(this.company).subscribe((company) => {
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
    this.companyService.updateLogo(data, id).subscribe(
      (company) => {
        this.company = company;
      },
      () => {},
    );
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
  getCountries() {
    this.countryService.getAllCountries().subscribe(
      (countries) => {
        this.listCountries = countries;
        this.filteredListCountries = this.listCountries;
      },
      () => {},
    );
  }

  refreshListCountry(value: any) {
    if (this.company.countryId !== null) {
      this.company.countryId = value;
      this.company.governorateId = null;
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
