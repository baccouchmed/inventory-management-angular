import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-other-requests',
  templateUrl: './other-requests.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtherRequestsComponent {
  /**
   * Constructor
   */
  constructor() {}
}
