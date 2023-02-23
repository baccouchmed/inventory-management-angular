import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../../../shared/services/user.service';
import { CompanyService } from '../../../../../shared/services/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { FuseMediaWatcherService } from '../../../../../../@fuse/services/media-watcher';
import { User } from '../../../../../shared/models/user';
import { MatPaginator } from '@angular/material/paginator';
import { FilterOptions } from '../../../../../shared/models/filter-options';
import { Company } from '../../../../../shared/models/company';
import { listTypeCompany } from '../../../../../shared/enums/types-company';
import { Pagination } from '../../../../../shared/models/pagination';
import { environment } from '../../../../../../environments/environment';
import { Country, Governorate, Municipality } from '../../../../../shared/models/country';
import { CountryService } from '../../../../../shared/services/country.service';
import { StatusContract } from '../../../../../shared/enums/status-contract';
import { ContractService } from '../../../../../shared/services/contract.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  filterOptions: FilterOptions = new FilterOptions();
  currentSize = 10;
  currentPage = 1;
  displayedList: Pagination<Company>;
  typingTimer;
  doneTypingInterval = 500;
  user: User;
  connectedUser: User;
  url = `${environment.api}/public/`;
  urlFlag = `${environment.services.i18n.url}/assets/`;

  isScreenSmall: boolean;
  path: string;
  searchFilter: string;
  isLoading = false;
  count: number;
  sortType: string;
  sortName: string;
  advancedFilter: boolean = false;
  country: Country;
  governorate: Governorate;
  municipality: Municipality;
  listCountries: Country[];
  filteredListCountries = [];
  listGovernorates: Governorate[];
  filteredListGovernorates = [];
  listMunicipalities: Municipality[];
  filteredListMunicipalities = [];
  typeCompany: string;
  listTypeCompany = listTypeCompany;
  readonly StatusContract = StatusContract;
  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private _router: Router,
    private route: ActivatedRoute,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseConfirmationService: FuseConfirmationService,
    private countryService: CountryService,
    private contractService: ContractService,
  ) {}

  ngOnInit(): void {
    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$.subscribe(({ matchingAliases }) => {
      // Check if the screen is small
      this.isScreenSmall = !matchingAliases.includes('sm');
    });
    // eslint-disable-next-line prefer-destructuring
    this.path = window.location.pathname.split('/apps/')[1];
    this.userService.getUserProfile().subscribe(
      (res: User) => {
        this.connectedUser = res;
        console.log(this.connectedUser.companyId.type);
      },
      () => {},
    );
    this.countryService.getAllCountries().subscribe((countries) => {
      this.listCountries = countries;
      this.filteredListCountries = this.listCountries;
      this.getList();
    });
  }
  pageChanged(event): void {
    let { pageIndex } = event;
    const { pageSize } = event;
    pageIndex++;
    if (pageSize !== this.currentSize) {
      pageIndex = 1;
      this.paginator.firstPage();
    }
    this.currentSize = pageSize;
    this.currentPage = pageIndex;
    this.getList();
  }
  getList(): void {
    this.isLoading = true;
    this.companyService
      .getValidateContracts(
        this.currentSize,
        this.currentPage,
        this.filterOptions.sortType,
        this.filterOptions.sortName,
        this.filterOptions.search,
        this.country ? this.country._id : null,
        this.governorate ? this.governorate._id : null,
        this.municipality ? this.municipality._id : null,
        this.typeCompany,
      )
      .subscribe(
        (res: Pagination<Company>) => {
          this.displayedList = res;
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        },
      );
  }
  refresh(): void {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.getList();
    }, this.doneTypingInterval);
  }
  openShow(row) {
    this._router.navigate([`${row._id}`], {
      relativeTo: this.route,
      queryParams: { companyName: row.name },
    });
  }
  openEdit(company) {
    this._router.navigate([`${company._id}/edit`], { relativeTo: this.route });
  }
  updateSearch() {
    clearTimeout(this.typingTimer);
    this.filterOptions.search = this.searchFilter;
    this.isLoading = true;
    this.typingTimer = setTimeout(() => {
      this.paginator?.firstPage();
      this.getList();
    }, this.doneTypingInterval);
  }
  updateSort(sort) {
    this.isLoading = true;
    switch (sort) {
      case 'sortType':
        if (this.sortType === 'up') {
          this.sortType = 'down';
        } else {
          this.sortType = 'up';
        }
        this.filterOptions.sortName = null;
        this.filterOptions.sortType = this.sortType;
        break;
      case 'sortName':
        if (this.sortName === 'up') {
          this.sortName = 'down';
        } else {
          this.sortName = 'up';
        }
        this.filterOptions.sortType = null;
        this.filterOptions.sortName = this.sortName;
        break;
      default:
        break;
    }
    this.getList();
  }

  filter() {}

  refreshGovernorates() {
    this.governorate = null;
    this.municipality = null;
    this.listMunicipalities = [];
    this.filteredListMunicipalities = [];
    this.countryService.getGovernorates(this.country._id).subscribe((governorates) => {
      this.listGovernorates = governorates;
      this.filteredListGovernorates = this.listGovernorates;
    });
  }
  refreshMunicipalities() {
    this.municipality = null;
    this.countryService.getMunicipalities(this.governorate._id).subscribe((municipalities) => {
      this.listMunicipalities = municipalities;
      this.filteredListMunicipalities = this.listMunicipalities;
    });
  }
}
