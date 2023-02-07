import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../../../../../shared/services/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../../../../shared/services/snack-bar.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FuseConfirmationService } from '../../../../../../../../@fuse/services/confirmation';
import { Company } from '../../../../../../../shared/models/company';
import { Site } from '../../../../../../../shared/models/site';
import { environment } from '../../../../../../../../environments/environment';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  id: string;
  company = new Company();
  sites: Site[];
  url = `${environment.services.i18n.url}/assets/`;
  isLoading: any;
  urlLogo = `${environment.api}/public/logo/`;
  logo: File = null;
  image: string;
  imageSrc: string | ArrayBuffer;
  logoExist = false;
  loadingLogo: boolean;
  constructor(
    private companyService: CompanyService,
    private _router: Router,
    private snackBarService: SnackBarService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private _fuseConfirmationService: FuseConfirmationService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.companyService.getCompany(this.id).subscribe(
          (company) => {
            this.company = { ...this.company, ...company };
            if (this.company.logo) {
              this.logoExist = true;
            }
            this.breadcrumbService.set('home/companies/:id', this.company.name);
          },
          () => {},
        );
      }
    });
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
      this.companyService
        .updateCompany(this.company)
        .subscribe(() => {
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
}
