import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

interface ServiceCard { icon: string; titleKey: string; descKey: string; available: boolean; link: string; }

@Component({
  selector: 'app-important-links',
  standalone: true,
  imports: [MatIconModule, TranslateModule],
  templateUrl: './important-links.html',
  styleUrl: './important-links.scss'
})
export class ImportantLinks {
  readonly services: ServiceCard[] = [
    { icon: 'open_in_new',    titleKey: 'IMPORTANT_LINKS.SVC_ERP.TITLE',    descKey: 'IMPORTANT_LINKS.SVC_ERP.DESC',    available: false, link: '' },
    { icon: 'cloud',          titleKey: 'IMPORTANT_LINKS.SVC_CLOUD.TITLE',  descKey: 'IMPORTANT_LINKS.SVC_CLOUD.DESC',  available: false, link: '' },
    { icon: 'videocam',       titleKey: 'IMPORTANT_LINKS.SVC_TEAMS.TITLE',  descKey: 'IMPORTANT_LINKS.SVC_TEAMS.DESC',  available: false, link: '' },
    { icon: 'task_alt',       titleKey: 'IMPORTANT_LINKS.SVC_PM.TITLE',     descKey: 'IMPORTANT_LINKS.SVC_PM.DESC',     available: false, link: '' },
    { icon: 'mail',           titleKey: 'IMPORTANT_LINKS.SVC_EMAIL.TITLE',  descKey: 'IMPORTANT_LINKS.SVC_EMAIL.DESC',  available: false, link: '' },
    { icon: 'travel_explore', titleKey: 'IMPORTANT_LINKS.SVC_PORTAL.TITLE', descKey: 'IMPORTANT_LINKS.SVC_PORTAL.DESC', available: false, link: '' },
  ];

  open(link: string) {
    window.open(link, '_blank', 'noopener,noreferrer');
  }
}
