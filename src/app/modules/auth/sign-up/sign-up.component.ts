import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/shared/services/auth.service';
import { CountryService } from '../../../shared/services/country.service';
import { Country, Governorate, Municipality } from '../../../shared/models/country';
import { Company } from '../../../shared/models/company';
import { listTypeCompany, TypeCompany } from '../../../shared/enums/types-company';

@Component({
  selector: 'app-auth-sign-up',
  templateUrl: './sign-up.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AuthSignUpComponent implements OnInit {
  company: Company = {
    name: 'test',
    address: 'Rades',
    email: 'test@test.com',
    label: 'test',
    phone: '29905061',
    postalCode: '2098',
    type: 'supplier' as TypeCompany,
  } as Company;
  readonly listTypeCompany = listTypeCompany;

  listCountries: Country[];
  filteredListCountries = [];
  listGovernorates: Governorate[];
  filteredListGovernorates = [];
  listMunicipalities: Municipality[];
  filteredListMunicipalities = [];
  /**
   * Constructor
   */
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private countryService: CountryService,
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.getCountries();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign up
   */
  signUp(form): void {
    // Do nothing if the form is invalid
    if (form.invalid) {
      return;
    }

    // Sign up
    this._authService.signUp(this.company).subscribe(
      (response) => {
        // Navigate to the confirmation required page
        this._router.navigateByUrl(`/confirmation-required?id=${response.id}`);
      },
      () => {},
    );
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
