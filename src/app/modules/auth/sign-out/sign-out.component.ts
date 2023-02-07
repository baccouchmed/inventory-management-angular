import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/shared/services/auth.service';
import { Capacitor } from '@capacitor/core';
import { User } from '../../../shared/models/user';
import { UserService } from '../../../shared/services/user.service';
import { CompanyService } from '../../../shared/services/company.service';

@Component({
  selector: 'app-auth-sign-out',
  templateUrl: './sign-out.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AuthSignOutComponent implements OnInit, OnDestroy {
  countdown = 5;
  user: User;
  countdownMapping: any = {
    '=1': '# second',
    other: '# seconds',
  };
  private timer: NodeJS.Timeout;

  /**
   * Constructor
   */
  constructor(
    private _authService: AuthService,
    private userService: UserService,
    private companyService: CompanyService,
    private _router: Router,
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      (res: User) => {
        this.user = res;
      },
      () => {},
    );
    if (Capacitor.isNativePlatform()) {
      this.signOut();
    } else {
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.signOut();
        }
      }, 1000);
    }
  }

  /**
   * Sign-out
   */
  signOut(): void {
    this._authService.signOut();
    this._router.navigate(['sign-in']);
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
