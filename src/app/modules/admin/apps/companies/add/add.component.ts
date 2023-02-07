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

  constructor(
    private companyService: CompanyService,
    private _router: Router,
    private snackBarService: SnackBarService,
    private _fuseConfirmationService: FuseConfirmationService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.set('home/companies/add', 'Add');
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
}
