import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../../../../shared/services/snack-bar.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FuseConfirmationService } from '../../../../../../../../@fuse/services/confirmation';
import { CompanyProduct, Product, TypeProduct } from '../../../../../../../shared/models/inventory';
import { CompanyProductService } from '../../../../../../../shared/services/company-product.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  isLoading: boolean;
  urlLogo = `${environment.api}/public/logo/`;
  company = new CompanyProduct();
  url = `${environment.services.i18n.url}/assets/`;
  id: string;
  listStages: TypeProduct[];
  filteredListStages = [];
  stageId: any[] = [];

  logo: File = null;
  image: string;
  imageSrc: string | ArrayBuffer;
  logoExist = false;
  selectedTypeProduct: any;
  typeProducts: TypeProduct[];
  products: Product[][];
  constructor(
    private companyProductService: CompanyProductService,
    private _router: Router,
    private snackBarService: SnackBarService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private _fuseConfirmationService: FuseConfirmationService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (param) => {
        this.id = param.get('id');
        if (this.id) {
          this.companyProductService.getCompany(this.id).subscribe(
            (company) => {
              this.company = { ...this.company, ...company };
              this.companyProductService.getCompanyTypeProduct(company?._id).subscribe(
                (data) => {
                  this.typeProducts = data.companyProductTypeProducts;
                  this.products = data.products;
                  console.log(this.typeProducts);
                  console.log(this.products);
                  this.isLoading = false;
                },
                () => {
                  this.isLoading = false;
                },
              );
              this.breadcrumbService.set('home/companiesproducts/:id', this.company.name);
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
        this.companyProductService.deleteCompany(this.company._id).subscribe(() => {
          this._router.navigate(['']);
        });
      }
    });
  }

  addCompany() {
    this._router.navigate(['/home/companiesproducts/add']);
  }

  editCompany() {
    this._router.navigate([`/home/companiesproducts/${this.company._id}/edit`]);
  }
  openEdit(typeProduct, event) {
    event.stopPropagation();
    this.selectedTypeProduct = typeProduct;
  }
  closeDetails() {
    this.selectedTypeProduct = null;
  }
}
