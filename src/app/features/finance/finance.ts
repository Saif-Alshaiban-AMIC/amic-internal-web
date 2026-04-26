import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

interface ServiceCard { icon: string; titleKey: string; descKey: string; available: boolean; }

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [MatIconModule, TranslateModule],
  templateUrl: './finance.html',
  styleUrl: './finance.scss'
})
export class Finance {
  readonly services: ServiceCard[] = [
    { icon: 'request_quote',   titleKey: 'FINANCE.SVC_BUDGET.TITLE',   descKey: 'FINANCE.SVC_BUDGET.DESC',   available: false },
    { icon: 'receipt_long',    titleKey: 'FINANCE.SVC_EXPENSE.TITLE',  descKey: 'FINANCE.SVC_EXPENSE.DESC',  available: false },
    { icon: 'description',     titleKey: 'FINANCE.SVC_INVOICE.TITLE',  descKey: 'FINANCE.SVC_INVOICE.DESC',  available: false },
    { icon: 'bar_chart',       titleKey: 'FINANCE.SVC_REPORTS.TITLE',  descKey: 'FINANCE.SVC_REPORTS.DESC',  available: false },
    { icon: 'shopping_bag',    titleKey: 'FINANCE.SVC_PO.TITLE',       descKey: 'FINANCE.SVC_PO.DESC',       available: false },
    { icon: 'account_balance', titleKey: 'FINANCE.SVC_COST.TITLE',     descKey: 'FINANCE.SVC_COST.DESC',     available: false },
  ];
}
