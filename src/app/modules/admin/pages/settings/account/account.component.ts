import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { User } from '../../../../../shared/models/user';
import { UserService } from '../../../../../shared/services/user.service';
import { environment } from '../../../../../../environments/environment';
import { TranslocoHttpLoader } from '../../../../../transloco/transloco-root.module';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { Router } from '@angular/router';
import { Types } from '../../../../../shared/enums/types';

@Component({
  selector: 'app-settings-account',
  templateUrl: './account.component.html',
})
export class SettingsAccountComponent implements OnInit {
  Types = Types;
  avatar: File = null;
  loadingAvatar = false;
  image: string;
  urlAvatar = `${environment.api}/public/avatar/`;
  urlFlag = `${environment.services.i18n.url}/assets/`;
  loadingYouAre = false;
  user: User;
  imageSrc: string | ArrayBuffer;
  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private translocoHttpLoader: TranslocoHttpLoader,
    private snackBarService: SnackBarService,
    private _router: Router,
  ) {}

  /**
   * On init
   */
  ngOnInit(): void {
      this.userService.getUserProfile().subscribe((user: User) => {
        this.user = user;
      });
  }
  youAreSubmit(form: NgForm): void {
    if (form.valid) {
      this.loadingYouAre = true;
      this.userService.updatePersonalInfo(this.user).subscribe(
        (d: User) => {
          this.user = d;
          this.loadingYouAre = false;
          this.snackBarService.openSnackBar('Profile updated successfully', 'success');
          this._router.navigate([`/`]);
        },
        () => {
          this.loadingYouAre = false;
        },
      );
    }
  }
  onAvatarSelected(event: Event): void {
    if (event.target['files'] && event.target['files'].length > 0) {
      [this.avatar] = event.target['files'];
      const file = event.target['files'][0];
      const reader = new FileReader();
      reader.onload = () => (this.imageSrc = reader.result);
      reader.readAsDataURL(file);
      this.sendAvatar();
    }
  }
  sendAvatar(): void {
    const data: FormData = new FormData();
    data.append(`avatar`, this.avatar, this.avatar.name);
    this.loadingAvatar = true;
    this.userService.updateMyAvatar(data).subscribe(
      (user: User) => {
        this.user.avatar = user.avatar;
        this.loadingAvatar = false;
      },
      () => {
        this.loadingAvatar = false;
      },
    );
  }
}
