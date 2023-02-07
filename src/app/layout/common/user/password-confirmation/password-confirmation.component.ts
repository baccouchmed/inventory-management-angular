import { Component } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-password-confirmation',
  templateUrl: './password-confirmation.component.html',
  styleUrls: ['./password-confirmation.component.scss'],
})
export class PasswordConfirmationComponent {
  password: string;
  isLoading = false;
  constructor(
    private userService: UserService,
    public matDialogRef: MatDialogRef<PasswordConfirmationComponent>,
  ) {}
  discard() {
    this.matDialogRef.close();
  }
  confirm() {
    if (this.password) {
      this.isLoading = true;
      this.userService.checkPassword(this.password).subscribe(
        () => {
          this.isLoading = false;
          this.matDialogRef.close(this.password);
        },
        () => {
          this.isLoading = false;
        },
      );
    }
  }
}
