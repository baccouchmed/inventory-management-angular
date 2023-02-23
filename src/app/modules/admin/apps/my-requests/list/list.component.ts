import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { FuseMediaWatcherService } from '../../../../../../@fuse/services/media-watcher';
import { MatPaginator } from '@angular/material/paginator';
import { FilterOptions } from '../../../../../shared/models/filter-options';
import { Pagination } from '../../../../../shared/models/pagination';
import { environment } from '../../../../../../environments/environment';
import { UserState } from '../../../../../shared/enums/userState';
import { listTypeCompany } from '../../../../../shared/enums/types-company';
import { listStatusRequest, StatusRequest } from '../../../../../shared/enums/status-request';
import { FeatureCodes } from '../../../../../shared/enums/feature-codes';
import { FeatureActions } from '../../../../../shared/enums/feature-actions';
import { CompanyProductService } from '../../../../../shared/services/company-product.service';
import { CompanyProduct, Product, ProductRequest, TypeProduct } from 'app/shared/models/inventory';
import { FilterProduct } from 'app/shared/models/filter-product';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import { ProductRequestService } from '../../../../../shared/services/product-request.service';
import { BadgeService } from '../../../../../shared/services/badge.service';
import { UserService } from 'app/shared/services/user.service';
import { Country, Governorate, Municipality } from '../../../../../shared/models/country';
import { Company } from '../../../../../shared/models/company';
import { CountryService } from '../../../../../shared/services/country.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  filterOptions: FilterOptions = new FilterOptions();
  listUserState = UserState;
  currentSize = 10;
  currentPage = 1;
  displayedList: Pagination<ProductRequest>;
  typingTimer;
  doneTypingInterval = 500;
  url = `${environment.api}/public/`;
  isScreenSmall: boolean;
  openFilters: boolean = false;
  path: string;
  searchFilter: string;
  isLoading = false;
  count: number;
  sortCode: string;
  sortName: string;
  featureCodes = FeatureCodes;
  featureActions = FeatureActions;
  urlLogo = `${environment.api}/public/logo/`;
  filterProduct = new FilterProduct();
  listCompanies: CompanyProduct[];
  filteredListCompanies = [];
  listTypeProducts: TypeProduct[];
  filteredListTypeProducts = [];
  today = moment().format();
  editQuantityRequested: boolean[];
  selectedProductRequest: ProductRequest;
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
  listStatusRequest = listStatusRequest;
  readonly StatusRequest = StatusRequest;
  myCompany: Company;
  statusRequest: string;

  constructor(
    private companyProductService: CompanyProductService,
    private productRequestService: ProductRequestService,
    private _router: Router,
    private route: ActivatedRoute,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseConfirmationService: FuseConfirmationService,
    private badgeService: BadgeService,
    private userService: UserService,
    private countryService: CountryService,
  ) {}

  ngOnInit(): void {
    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$.subscribe(({ matchingAliases }) => {
      // Check if the screen is small
      this.isScreenSmall = !matchingAliases.includes('sm');
    });
    const obs = [
      this.companyProductService.getAllTypeProducts(),
      this.companyProductService.getListCompanies(),
    ];
    this.isLoading = true;
    forkJoin(obs).subscribe(
      (result: [TypeProduct[], CompanyProduct[]]) => {
        this.listCompanies = result[1];
        this.filteredListCompanies = this.listCompanies;
        this.listTypeProducts = result[0];
        this.filteredListTypeProducts = this.listTypeProducts;
        this.getList();
      },
      () => {
        this.isLoading = false;
      },
    );
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
    this.productRequestService
      .getMyRequests(this.currentSize, this.currentPage, this.searchFilter, 'myRequests')
      .subscribe(
        (res: Pagination<Product>) => {
          this.displayedList = res;
          this.editQuantityRequested = this.displayedList.data.map(() => false);
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
    this._router.navigate([`${row._id}`], { relativeTo: this.route });
  }
  openEdit(user) {
    this._router.navigate([`${user._id}/edit`], { relativeTo: this.route });
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
      case 'sortCode':
        if (this.sortCode === 'up') {
          this.sortCode = 'down';
        } else {
          this.sortCode = 'up';
        }
        this.filterOptions.sortName = null;
        this.filterOptions.sortCode = this.sortCode;
        break;
      case 'sortName':
        if (this.sortName === 'up') {
          this.sortName = 'down';
        } else {
          this.sortName = 'up';
        }
        this.filterOptions.sortCode = null;
        this.filterOptions.sortName = this.sortName;
        break;
      default:
        break;
    }

    this.getList();
  }

  openFilter() {
    this.openFilters = !this.openFilters;
  }

  addStock() {
    this._router.navigate(['home/supplierclient']);
  }
  openDetails(productRequest, event) {
    event.stopPropagation();
    this.selectedProductRequest = productRequest;
  }
  closeDetails() {
    this.selectedProductRequest = null;
  }

  updateQuantityRequested(requestId: string, id: string, quantityRequested: number) {
    this.productRequestService
      .updateQuantityRequested(requestId, id, quantityRequested)
      .subscribe();
  }

  validateRequest(requestId: string, index: number) {
    this.productRequestService.requesterValidate(requestId).subscribe(() => {
      this.displayedList.data[index].requesterValidation = true;
      this.badgeService.badgeMyRequests().subscribe(() => {
        let navigation = this.userService._navigations.getValue();
        navigation[
          navigation.findIndex((val) => val.code === FeatureCodes.crm.toString())
        ].children[
          navigation[
            navigation.findIndex((val) => val.code === FeatureCodes.crm.toString())
          ].children.findIndex((val) => val.code === FeatureCodes.myRequests.toString())
        ].badge.title = this.badgeService._badgeMyRequest.getValue();
        console.log(navigation);
        this.userService._navigations.next(navigation);
      });
    });
  }

  downloadInvoice(_id: string) {}
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
