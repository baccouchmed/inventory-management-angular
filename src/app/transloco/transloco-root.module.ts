import { HttpClient } from '@angular/common/http';
import {
  TRANSLOCO_LOADER,
  Translation,
  TranslocoLoader,
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule,
} from '@ngneat/transloco';
import { Injectable, NgModule } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LocalProject } from '../shared/models/localProject';
import { Local } from '../shared/models/local';
import { Project } from '../shared/models/project';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  endpoint = `${environment.services.i18n.url}/internationalization`;
  code = environment.code;
  constructor(private http: HttpClient) {}
  getTranslation(lang: string) {
    const url =
      lang === 'key' ? `./assets/i18n/${lang}.json` : `${this.endpoint}/${this.code}/${lang}`;
    return this.http.get<Translation>(url).pipe(tap((response: any) => response));
  }
  // get locals
  getAvailableLocals(): Observable<LocalProject[]> {
    return this.http
      .get<LocalProject[]>(`${this.endpoint}/${this.code}/locals`)
      .pipe(tap((response: any) => response));
  }
  // get all locals
  getAllLocals(): Observable<Local[]> {
    return this.http.get<Local[]>(`${this.endpoint}`).pipe(tap((response: any) => response));
  }
  // get locals
  getDefaultLocal(): Observable<Local> {
    return this.http
      .get<Local>(`${this.endpoint}/${this.code}/default`)
      .pipe(tap((response: any) => response));
  }
  // get Project
  getProject(): Observable<Project> {
    return this.http
      .get<Project>(`${this.endpoint}/project/${this.code}`)
      .pipe(tap((response: any) => response));
  }
}
@NgModule({
  exports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        fallbackLang: 'key',
        defaultLang: 'en-US',
        availableLangs: ['key', 'en-US'],
        reRenderOnLangChange: true,
        prodMode: environment.production,
      }),
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
  ],
})
export class TranslocoRootModule {}
