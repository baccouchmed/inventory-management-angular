import { Component, OnInit } from '@angular/core';
import { ParamProjectService } from '../../../../../shared/services/param-project.service';
import { ParamProject } from '../../../../../shared/models/paramProject';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  paramProject: ParamProject;
  isLoading: boolean;
  suspendPassword: string;
  constructor(
    private paramProjectService: ParamProjectService,
    private _router: Router,
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
  editParamProject() {
    this._router.navigate([`./edit`], { relativeTo: this.route });
  }
}
