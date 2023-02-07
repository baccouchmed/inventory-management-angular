import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/shared/services/auth.service';
import { Direction } from '@angular/cdk/bidi';
import { environment } from '../../../../environments/environment';
import { TranslocoHttpLoader } from '../../../transloco/transloco-root.module';
import { CompanyService } from '../../../shared/services/company.service';
import { User } from '../../../shared/models/user';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-auth-sign-in',
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AuthSignInComponent implements OnInit {
  @ViewChild('signInNgForm') signInNgForm: NgForm;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  signInForm: FormGroup;
  showAlert = false;
  orientation: Direction;
  url = `${environment.services.i18n.url}/assets/`;
  user: User;
  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    private translocoHttpLoader: TranslocoHttpLoader,
    private companyService: CompanyService,
    private userService: UserService,
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.translocoHttpLoader.getDefaultLocal().subscribe((lang) => {
      this.orientation = lang.orientation as Direction;
    });
    const email = localStorage.getItem('email') || '';
    // Create the form
    this.signInForm = this._formBuilder.group({
      email: [email, [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [''],
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign in
   */
  signIn(): void {
    // Return if the form is invalid
    if (this.signInForm.invalid) {
      return;
    }

    // Disable the form
    this.signInForm.disable();

    // Hide the alert
    this.showAlert = false;

    // Sign in
    this._authService.signIn(this.signInForm.value).subscribe(
      () => {
        // Set the redirect url.
        // The '/signed-in-redirect' is a dummy url to catch the internationalization and redirect the user
        // to the correct page after a successful sign in. This way, that url can be set via
        // routing file and we don't have to touch here.
        this.userService.get().subscribe((user: User) => {
          this.user = user;
          localStorage.setItem('connectedSite', user.defaultSite?._id);
          this.companyService._company.next(user.companyId);
          this.companyService._site.next(user.defaultSite);
        });
        const redirectURL =
          this._activatedRoute.snapshot.queryParamMap.get('redirectURL') ||
          this.userService._defaultLink.getValue() ||
          '/signed-in-redirect';
        localStorage.setItem('email', this.signInForm.get('email').value);
        // Navigate to the redirect url
        this._router.navigateByUrl(redirectURL);
      },
      () => {
        // Re-enable the form
        this.signInForm.enable();

        // Show the alert
        this.showAlert = true;
      },
    );
  }
  displayLang(orientation) {
    this.orientation = orientation;
  }
  clearEmail() {
    this.signInForm.get('email').setValue('');
    localStorage.removeItem('email');
  }
}
