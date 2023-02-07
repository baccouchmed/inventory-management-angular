import { Component, OnInit } from '@angular/core';
import { ParamProjectService } from '../../../../../../../shared/services/param-project.service';
import { ParamProject } from '../../../../../../../shared/models/paramProject';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../../../@fuse/services/confirmation';
@Component({
  selector: 'app-details',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  paramProject: ParamProject;
  isLoading: boolean;
  suspendPassword: string;
  constructor(
    private paramProjectService: ParamProjectService,

    private _router: Router,
    private _fuseConfirmationService: FuseConfirmationService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.paramProjectService.getParamProject().subscribe(
      (paramProject) => {
        this.paramProject = paramProject;
        this.suspendPassword = this.paramProject.suspendPassword === true ? 'true' : 'false';
      },
      () => {},
    );
  }
  updateParam(myForm: NgForm): void {
    if (myForm.valid) {
      if (this.suspendPassword === 'true') {
        this.paramProject.suspendPassword = true;
      } else {
        this.paramProject.suspendPassword = false;
      }
      this.paramProjectService.updateParam(this.paramProject).subscribe(() => {
        this._router.navigate(['../'], { relativeTo: this.route });
      });
    }
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
}
