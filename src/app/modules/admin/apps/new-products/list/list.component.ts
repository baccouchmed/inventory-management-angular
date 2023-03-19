import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { FuseMediaWatcherService } from '../../../../../../@fuse/services/media-watcher';
import { MatPaginator } from '@angular/material/paginator';
import { FilterOptions } from '../../../../../shared/models/filter-options';
import { Pagination } from '../../../../../shared/models/pagination';
import { environment } from '../../../../../../environments/environment';
import { UserState } from '../../../../../shared/enums/userState';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { FeatureCodes } from '../../../../../shared/enums/feature-codes';
import { FeatureActions } from '../../../../../shared/enums/feature-actions';
import { CompanyProductService } from '../../../../../shared/services/company-product.service';
import { CompanyProduct, Product, TypeProduct } from 'app/shared/models/inventory';
import { FilterProduct } from 'app/shared/models/filter-product';
import { forkJoin } from 'rxjs';

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
  displayedList: Pagination<Product>;
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
  advancedFilter: any;
  typeProduct: TypeProduct;
  companyProduct: CompanyProduct;
  validTypeProductIdNew: TypeProduct[];
  validCompanyProductIdNew: CompanyProduct[];
  validProductNew: string[];

  constructor(
    private companyProductService: CompanyProductService,
    private _router: Router,
    private route: ActivatedRoute,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseConfirmationService: FuseConfirmationService,
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
        this.listTypeProducts = result[0];
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
    this.companyProductService
      .getNewProducts(
        this.currentSize,
        this.currentPage,
        this.searchFilter,
        null,
        this.typeProduct ? this.typeProduct._id : null,
        this.companyProduct ? this.companyProduct._id : null,
      )
      .subscribe(
        (res: Pagination<Product>) => {
          this.displayedList = res;
          this.validProductNew = res.data.map(() => null);
          this.validTypeProductIdNew = res.data.map(() => null);
          this.validCompanyProductIdNew = res.data.map(() => null);
          this.filteredListCompanies = res.data.map(() => this.listCompanies);
          this.filteredListTypeProducts = res.data.map(() => this.listTypeProducts);
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

  addProduct() {
    this._router.navigate([`add`], { relativeTo: this.route });
  }

  validateNewProduct(product, index) {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'New product',
      message: 'Would you like to validate this new product ?',
      icon: {
        show: true,
        name: 'heroicons_outline:academic-cap',
        color: 'success',
      },
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
        this.companyProductService
          .validateNewProduct(product._id, {
            validProductNew: this.validProductNew[index],
            validTypeProductIdNew: this.validTypeProductIdNew[index]
              ? this.validTypeProductIdNew[index]._id
              : null,
            validCompanyProductIdNew: this.validCompanyProductIdNew[index]
              ? this.validCompanyProductIdNew[index]._id
              : null,
          })
          .subscribe(() => {
            this.getList();
          });
      }
    });
  }
}
