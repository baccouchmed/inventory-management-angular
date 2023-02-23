import { Component, OnInit } from '@angular/core';
import { Company } from '../../../../../shared/models/company';
import { environment } from '../../../../../../environments/environment';
import { CompanyService } from '../../../../../shared/services/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { UserService } from '../../../../../shared/services/user.service';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  isLoading: boolean;
  urlLogo = `${environment.api}/public/logo/`;
  company = new Company();
  url = `${environment.services.i18n.url}/assets/`;
  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private _router: Router,
    private snackBarService: SnackBarService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private _fuseConfirmationService: FuseConfirmationService,
  ) {}
  ngOnInit(): void {
    this.companyService.getCompany(this.userService._user.getValue().companyId._id).subscribe(
      (company) => {
        this.company = { ...this.company, ...company };
        this.breadcrumbService.set('home/companies/:id', this.company.name);
      },
      () => {},
    );
  }
  deleteCompany() {
    this.companyService.getSites(this.company._id).subscribe((sites) => {
      if (sites.length > 0) {
        this.snackBarService.openSnackBar('There is child data related to this record', 'error');
      } else {
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
    });
  }
  editCompany() {
    this._router.navigate([`/home/company/edit`]);
  }
}
