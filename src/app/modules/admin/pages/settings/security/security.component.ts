import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../../shared/services/user.service';
import { User } from '../../../../../shared/models/user';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
@Component({
  selector: 'app-settings-security',
  templateUrl: './security.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SettingsSecurityComponent implements OnInit {
  public counter: number;
  password: string;
  code: string;
  newPassword: string;
  sendedCode: boolean;
  user: User;
  testCode: boolean;
  loadingSubmit: boolean;
  /**
   * Constructor
   */
  constructor(
    private userService: UserService,
    private _router: Router,
    private snackBarService: SnackBarService,
    private _fuseConfirmationService: FuseConfirmationService,
    private route: ActivatedRoute,
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    // Subscribe to user changes
    this.userService.getUserProfile().subscribe((user: User) => {
      this.user = user;
    });
  }
  changePassword(form: NgForm): void {
    if (form.valid) {
      this.loadingSubmit = true;
      this.userService
        .changePassword(this.password, this.newPassword, this.code, this.user._id)
        .subscribe(
          () => {
            this.loadingSubmit = false;
            this.snackBarService.openSnackBar('Password has been changed successfully', 'success');
            this._router.navigate(['/']);
          },
          () => {
            this.code = null;
            this.loadingSubmit = false;
          },
        );
    }
  }

  clear(form: NgForm): void {
    form.resetForm();
  }

  sendCode() {
    this.counter = 30;
    this.loadingSubmit = true;
    this.userService.sendCode(this.user._id, this.password, this.newPassword).subscribe(
      () => {
        this.snackBarService.openSnackBar('code has been sent successfully', 'success');
        this.testCode = true;
        this.sendedCode = true;
        this.loadingSubmit = false;
        this.doCountdoun();
      },
      () => {
        this.testCode = false;
        this.loadingSubmit = false;
      },
    );
  }
  doCountdoun() {
    setTimeout(() => {
      this.counter = this.counter - 1;
      this.processCountdown();
    }, 1000);
  }
  processCountdown() {
    if (this.counter === 0) {
      this.testCode = false;
    } else {
      this.doCountdoun();
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
