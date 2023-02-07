import { Component, OnInit } from '@angular/core';
import { Site } from '../../../../../../../shared/models/site';
import { environment } from '../../../../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../../../../shared/services/snack-bar.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FuseConfirmationService } from '../../../../../../../../@fuse/services/confirmation';
import { ThirdPartyService } from '../../../../../../../shared/services/thirdparty.service';
import { ThirdParty } from '../../../../../../../shared/models/third-party';
import { Natures } from '../../../../../../../shared/enums/natures';
import { TypeThirdPartyService } from '../../../../../../../shared/services/typethirdparty.service';
import { TypeThirdParty } from '../../../../../../../shared/models/third-party-type';
import { fuseAnimations } from '../../../../../../../../@fuse/animations';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  animations: fuseAnimations,
})
export class DetailsComponent implements OnInit {
  isLoading: boolean;
  thirdParty = new ThirdParty();
  url = `${environment.services.i18n.url}/assets/`;
  id: string;
  readonly Natures = Natures;
  filteredListTypes: TypeThirdParty[];
  companyId: string;
  constructor(
    private thirdPartyService: ThirdPartyService,
    private _router: Router,
    private snackBarService: SnackBarService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private _fuseConfirmationService: FuseConfirmationService,
    private typeThirdPartyService: TypeThirdPartyService,
  ) {}

  ngOnInit(): void {
    this.typeThirdPartyService.getAllTypeThirdParty().subscribe(
      (types) => {
        this.filteredListTypes = types;
      },
      () => {},
    );
    this.route.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.thirdPartyService.getSingelThirdParty(this.id).subscribe(
          (thirdParty) => {
            this.thirdParty = thirdParty;
            this.breadcrumbService.set('home/thirdparty/:id', this.thirdParty.label);
          },
          () => {},
        );
      }
    });
  }

  deleteThirdParty() {
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
        this.thirdPartyService.deleteThirdParty(this.thirdParty._id).subscribe(() => {
          this._router.navigate(['/home/thirdparty']);
        });
      }
    });
  }

  addThirdParty() {
    this._router.navigate(['/home/thirdparty/add']);
  }

  updateThirdParty() {
    this._router.navigate([`/home/thirdparty/${this.thirdParty._id}/edit`]);
  }
}
