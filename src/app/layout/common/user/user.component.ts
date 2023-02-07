import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Company } from '../../../shared/models/company';
import { User } from '../../../shared/models/user';
import { UserService } from '../../../shared/services/user.service';
import { Site } from '../../../shared/models/site';
import { ParamProject } from '../../../shared/models/paramProject';
import { Types } from '../../../shared/enums/types';
import { MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../../shared/services/company.service';
import { ParamProjectService } from '../../../shared/services/param-project.service';
import { MatDialogService } from '../../../shared/services/mat-dialog.service';
import { AuthService } from '../../../shared/services/auth.service';
import { PasswordConfirmationComponent } from './password-confirmation/password-confirmation.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'user',
})
export class UserComponent implements OnInit, OnDestroy {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_showAvatar: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */
  @Output() refreshSite: EventEmitter<null> = new EventEmitter<null>();
  @Output() refreshCompany: EventEmitter<null> = new EventEmitter<null>();
  @Output() loadingSites = new EventEmitter();
  @Input() showAvatar = true;

  user: User;
  urlAvatar = `${environment.api}/public/avatar/`;
  listCompanies: Company[];
  listSites: Site[];
  connectedCompany: Company;
  connectedSite: Site;
  changePassword: MatDialogRef<any>;
  paramProject: ParamProject;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  url = environment.api;
  urlGuide = `${this.url}/docs/crm-user-guide.pdf`;
  releaseNotes = `${this.url}/docs/release-notes.pdf`;
  /**
   * Constructor
   */
  constructor(
    private _router: Router,
    private userService: UserService,
    private companyService: CompanyService,
    private matDialogService: MatDialogService,
    private paramProjectService: ParamProjectService,
    private _authService: AuthService,
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to user changes
    this.userService.user$.subscribe((user: User) => {
      this.user = user;
      if (user.type === Types.super) {
        this.companyService.getListCompanies().subscribe(
          (companies) => {
            this.listCompanies = companies;
            this.connectedCompany = user?.companyId;
          },
          () => {},
        );
      }
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign out
   */
  signOut(): void {
    this._router.navigate(['/sign-out']);
  }

  redirectTo(link: string) {
    this._router.navigate([link]);
  }

  refreshTokenCompany(company, menuTrigger, password = null) {
    this._authService.refreshToken({ companyId: company._id, password }).subscribe(() => {
      this.connectedCompany = company;
      this.companyService._company.next(company);
      this.refreshCompany.next(null);
    });
  }

  switchCompany(company, menuTrigger, event) {
    event?.stopPropagation();
    this.paramProjectService.getParamProject().subscribe(
      (paramProject) => {
        this.paramProject = paramProject;
        if (!paramProject?.suspendPassword) {
          this.changePassword = this.matDialogService.openDialog(PasswordConfirmationComponent);
          this.changePassword.afterClosed().subscribe((password: string) => {
            if (password) {
              this.refreshTokenCompany(company, menuTrigger, password);
            }
          });
        } else {
          this.refreshTokenCompany(company, menuTrigger);
        }
      },
      () => {},
    );
  }
}
