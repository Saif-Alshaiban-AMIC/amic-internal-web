import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

interface ServiceCard { icon: string; titleKey: string; descKey: string; available: boolean; }

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [MatIconModule, TranslateModule],
  templateUrl: './policies.html',
  styleUrl: './policies.scss'
})
export class Policies {
  readonly services: ServiceCard[] = [
    { icon: 'gavel',             titleKey: 'POLICIES.SVC_HR.TITLE',         descKey: 'POLICIES.SVC_HR.DESC',         available: false },
    { icon: 'computer',          titleKey: 'POLICIES.SVC_IT.TITLE',         descKey: 'POLICIES.SVC_IT.DESC',         available: false },
    { icon: 'account_balance',   titleKey: 'POLICIES.SVC_FINANCE.TITLE',    descKey: 'POLICIES.SVC_FINANCE.DESC',    available: false },
    { icon: 'health_and_safety', titleKey: 'POLICIES.SVC_HSE.TITLE',        descKey: 'POLICIES.SVC_HSE.DESC',        available: false },
    { icon: 'diversity_3',       titleKey: 'POLICIES.SVC_CONDUCT.TITLE',    descKey: 'POLICIES.SVC_CONDUCT.DESC',    available: false },
    { icon: 'policy',            titleKey: 'POLICIES.SVC_COMPLIANCE.TITLE', descKey: 'POLICIES.SVC_COMPLIANCE.DESC', available: false },
  ];
}
