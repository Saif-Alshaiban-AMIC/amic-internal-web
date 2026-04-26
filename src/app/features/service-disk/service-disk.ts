import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

interface ServiceCard { icon: string; titleKey: string; descKey: string; available: boolean; }

@Component({
  selector: 'app-service-disk',
  standalone: true,
  imports: [MatIconModule, TranslateModule],
  templateUrl: './service-disk.html',
  styleUrl: './service-disk.scss'
})
export class ServiceDisk {
  readonly services: ServiceCard[] = [
    { icon: 'confirmation_number', titleKey: 'SERVICE_DESK.SVC_OPEN.TITLE',      descKey: 'SERVICE_DESK.SVC_OPEN.DESC',      available: false },
    { icon: 'history',             titleKey: 'SERVICE_DESK.SVC_MY.TITLE',        descKey: 'SERVICE_DESK.SVC_MY.DESC',        available: false },
    { icon: 'leaderboard',         titleKey: 'SERVICE_DESK.SVC_DASHBOARD.TITLE', descKey: 'SERVICE_DESK.SVC_DASHBOARD.DESC', available: false },
    { icon: 'category',            titleKey: 'SERVICE_DESK.SVC_CATALOGUE.TITLE', descKey: 'SERVICE_DESK.SVC_CATALOGUE.DESC', available: false },
    { icon: 'notification_add',    titleKey: 'SERVICE_DESK.SVC_ANNOUNCE.TITLE',  descKey: 'SERVICE_DESK.SVC_ANNOUNCE.DESC',  available: false },
    { icon: 'feedback',            titleKey: 'SERVICE_DESK.SVC_FEEDBACK.TITLE',  descKey: 'SERVICE_DESK.SVC_FEEDBACK.DESC',  available: false },
  ];
}
