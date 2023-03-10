import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../../@fuse/services/confirmation';
import { FuseMediaWatcherService } from '../../../../../../../@fuse/services/media-watcher';
import { MatPaginator } from '@angular/material/paginator';
import { FilterOptions } from '../../../../../../shared/models/filter-options';
import { Pagination } from '../../../../../../shared/models/pagination';
import { environment } from '../../../../../../../environments/environment';
import { UserState } from '../../../../../../shared/enums/userState';
import { FeatureCodes } from '../../../../../../shared/enums/feature-codes';
import { FeatureActions } from '../../../../../../shared/enums/feature-actions';
import { CompanyProductService } from '../../../../../../shared/services/company-product.service';
import { CompanyProduct, Product, TypeProduct } from 'app/shared/models/inventory';
import { FilterProduct } from 'app/shared/models/filter-product';
import { forkJoin } from 'rxjs';
import { EventDateComponent } from './event-date/event-date.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductRequestService } from '../../../../../../shared/services/product-request.service';
import { SnackBarService } from '../../../../../../shared/services/snack-bar.service';
import { MatDialogService } from '../../../../../../shared/services/mat-dialog.service';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
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
  id: string;
  eventDate: MatDialogRef<any>;
  requestedProducts: Product[] = [];
  constructor(
    private companyProductService: CompanyProductService,
    private _router: Router,
    private route: ActivatedRoute,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseConfirmationService: FuseConfirmationService,
    private breadcrumbService: BreadcrumbService,
    private matDialogService: MatDialogService,
    private snackBarService: SnackBarService,
    private productRequestService: ProductRequestService,
  ) {}

  ngOnInit(): void {
    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$.subscribe(({ matchingAliases }) => {
      // Check if the screen is small
      this.isScreenSmall = !matchingAliases.includes('sm');
    });
    this.route.queryParams.subscribe((param) => {
      console.log(param.companyName);
      this.breadcrumbService.set('home/supplierclient/:id', param.companyName);
    });

    this.route.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
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
    this.companyProductService
      .getProducts(
        this.currentSize,
        this.currentPage,
        this.searchFilter,
        this.id,
        this.typeProduct ? this.typeProduct._id : null,
        this.companyProduct ? this.companyProduct._id : null,
      )
      .subscribe(
        (res: Pagination<Product>) => {
          this.displayedList = res;
          this.displayedList.data = this.displayedList.data.map((product) => ({
            ...product,
            requestedStock: this.requestedProducts.filter((val) => val._id === product._id).length
              ? this.requestedProducts.filter((val) => val._id === product._id)[0].requestedStock
              : null,
          }));
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
  addRequest() {
    if (this.requestedProducts.length) {
      this.eventDate = this.matDialogService.openDialog(EventDateComponent, {
        data: this.requestedProducts,
      });
      this.eventDate.afterClosed().subscribe((date: any) => {
        if (date) {
          this.productRequestService
            .createProductRequest({
              productsId: this.requestedProducts.map((val) => ({
                productId: val._id,
                quantityRequested: val.requestedStock,
              })),
              requestedId: this.id,
              dueDate: date,
            })
            .subscribe(() => {
              this._router.navigate([`home/myrequests`]);
            });
        }
      });
    } else {
      this.snackBarService.openSnackBar('select at least a quantity of products', 'error');
    }
  }

  updateRequestedProducts(product: Product) {
    this.requestedProducts = this.requestedProducts.filter((val) => val._id !== product._id);
    if (product.requestedStock && product.requestedStock > 0) {
      this.requestedProducts.push(product);
    }
    console.log(this.requestedProducts);
  }
}
