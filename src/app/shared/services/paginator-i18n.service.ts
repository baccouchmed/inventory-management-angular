import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslocoService } from '@ngneat/transloco';

export class PaginatorI18nService extends MatPaginatorIntl {
  private translocoService: TranslocoService;
  private rangeLabelIntl: string;
  injectTranslateService(translocoService: TranslocoService) {
    this.translocoService = translocoService;
    this.translocoService.langChanges$.subscribe(() => {
      setTimeout(() => {
        this.getTranslations();
      }, 500);
    });
    this.getTranslations();
  }
  getTranslations() {
    this.itemsPerPageLabel = this.translocoService.translate('Per page:');
    this.nextPageLabel = this.translocoService.translate('Next page');
    this.previousPageLabel = this.translocoService.translate('Previous page');
    this.firstPageLabel = this.translocoService.translate('First page');
    this.lastPageLabel = this.translocoService.translate('Last page');
    this.rangeLabelIntl = this.getRangeLabel.bind(this);
    this.changes.next();
  }

  getRangeLabel = (page, pageSize, length) => {
    if (length === 0 || pageSize === 0) {
      return this.translocoService.translate('0 out of', { length });
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return this.translocoService.translate(' - out of', {
      startIndex: startIndex + 1,
      endIndex,
      length,
    });
  };
}
