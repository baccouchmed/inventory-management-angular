import { Component, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { FuseNavigationService } from '@fuse/components/navigation';
import { environment } from '../../../../environments/environment';
import { TranslocoHttpLoader } from '../../../transloco/transloco-root.module';
import { Local } from '../../../shared/models/local';

@Component({
  selector: 'app-app-languages-signin',
  templateUrl: './languages-signin.component.html',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'languages',
})
export class LanguagesSigninComponent implements OnInit {
  @Output() orientation = new EventEmitter<string>();

  urlFlag = `${environment.services.i18n.url}/assets/`;
  selectedLang: Local;
  listLocals: any;
  /**
   * Constructor
   */

  constructor(
    private _fuseNavigationService: FuseNavigationService,
    private _translocoService: TranslocoService,
    private translocoHttpLoader: TranslocoHttpLoader,
  ) {}

  /**
   * On init
   */
  ngOnInit(): void {
    this.translocoHttpLoader.getAvailableLocals().subscribe((langs) => {
      this.listLocals = langs.map((lang) => ({ ...lang.localId }));
      this._translocoService.setAvailableLangs(this.listLocals.map((value) => value.key));
      this.translocoHttpLoader.getDefaultLocal().subscribe((lang) => {
        this.selectedLang = lang;
        this._translocoService.setActiveLang(lang.key);
      });
    });
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Set the active lang
   *
   * @param lang
   */
  setActiveLang(lang): void {
    // Set the active lang
    this._translocoService.setActiveLang(lang.key);
    this.orientation.emit(lang.orientation);
    this.selectedLang = lang;
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
