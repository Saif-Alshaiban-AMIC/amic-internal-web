import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

interface ServiceCard { icon: string; titleKey: string; descKey: string; available: boolean; }

@Component({
  selector: 'app-procurement',
  standalone: true,
  imports: [MatIconModule, TranslateModule],
  templateUrl: './procurement.html',
  styleUrl: './procurement.scss'
})
export class Procurement {
  readonly services: ServiceCard[] = [
    { icon: 'inventory_2',    titleKey: 'SUPPLY_CHAIN.SVC_PROC.TITLE',      descKey: 'SUPPLY_CHAIN.SVC_PROC.DESC',      available: false },
    { icon: 'store',          titleKey: 'SUPPLY_CHAIN.SVC_VENDOR.TITLE',     descKey: 'SUPPLY_CHAIN.SVC_VENDOR.DESC',    available: false },
    { icon: 'handshake',      titleKey: 'SUPPLY_CHAIN.SVC_CONTRACT.TITLE',   descKey: 'SUPPLY_CHAIN.SVC_CONTRACT.DESC',  available: false },
    { icon: 'local_shipping', titleKey: 'SUPPLY_CHAIN.SVC_DELIVERY.TITLE',   descKey: 'SUPPLY_CHAIN.SVC_DELIVERY.DESC',  available: false },
    { icon: 'warehouse',      titleKey: 'SUPPLY_CHAIN.SVC_INVENTORY.TITLE',  descKey: 'SUPPLY_CHAIN.SVC_INVENTORY.DESC', available: false },
    { icon: 'analytics',      titleKey: 'SUPPLY_CHAIN.SVC_SPEND.TITLE',      descKey: 'SUPPLY_CHAIN.SVC_SPEND.DESC',     available: false },
  ];
}
