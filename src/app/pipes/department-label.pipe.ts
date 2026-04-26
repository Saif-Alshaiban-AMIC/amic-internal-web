import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Transforms a department enum key (e.g. "HUMAN_RESOURCES") into a
 * human-readable label driven by the i18n translation file.
 * Adding or renaming a department only requires editing en.json / ar.json —
 * this pipe never needs to change (Open/Closed Principle).
 */
@Pipe({ name: 'deptLabel', standalone: true, pure: false })
export class DeptLabelPipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  transform(value: string | null | undefined): string {
    if (!value) return '';
    const translated = this.translate.instant('DEPT.' + value);
    // Fall back to the raw key if translation is missing
    return translated === 'DEPT.' + value ? value : translated;
  }
}
