import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

interface ServiceCard { icon: string; titleKey: string; descKey: string; available: boolean; }

@Component({
  selector: 'app-it',
  standalone: true,
  imports: [MatIconModule, TranslateModule],
  templateUrl: './it.html',
  styleUrl: './it.scss'
})
export class It {
  readonly services: ServiceCard[] = [
    { icon: 'support_agent',    titleKey: 'IT.SVC_SUPPORT.TITLE',   descKey: 'IT.SVC_SUPPORT.DESC',   available: false },
    { icon: 'devices',          titleKey: 'IT.SVC_EQUIPMENT.TITLE',  descKey: 'IT.SVC_EQUIPMENT.DESC', available: false },
    { icon: 'lock_open',        titleKey: 'IT.SVC_ACCESS.TITLE',    descKey: 'IT.SVC_ACCESS.DESC',    available: false },
    { icon: 'app_registration', titleKey: 'IT.SVC_LICENSE.TITLE',   descKey: 'IT.SVC_LICENSE.DESC',   available: false },
    { icon: 'wifi',             titleKey: 'IT.SVC_NETWORK.TITLE',   descKey: 'IT.SVC_NETWORK.DESC',   available: false },
    { icon: 'security',         titleKey: 'IT.SVC_SECURITY.TITLE',  descKey: 'IT.SVC_SECURITY.DESC',  available: false },
  ];
}
