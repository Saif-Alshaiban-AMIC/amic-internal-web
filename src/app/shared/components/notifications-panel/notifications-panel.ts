import { Component, output, signal, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

@Component({
  selector: 'app-notifications-panel',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './notifications-panel.html',
  styleUrl: './notifications-panel.scss'
})
export class NotificationsPanel {
  readonly close = output<void>();

  readonly notifications = signal<Notification[]>([
    { id: 1, title: 'Leave request approved', message: 'Your annual leave for Dec 24–26 was approved by HR.', time: '2 min ago', read: false, icon: 'event_available' },
    { id: 2, title: 'IT ticket resolved', message: 'Ticket #1042 — VPN access issue has been resolved.', time: '1 hr ago', read: false, icon: 'confirmation_number' },
    { id: 3, title: 'Payslip available', message: 'Your November payslip is ready to download.', time: 'Yesterday', read: true, icon: 'receipt' },
    { id: 4, title: 'Meeting reminder', message: 'All-hands meeting tomorrow at 10:00 AM.', time: '2 days ago', read: true, icon: 'notifications' },
  ]);

  readonly unreadCount = computed(() =>
    this.notifications().filter(n => !n.read).length
  );

  markAllRead() {
    this.notifications.update(list => list.map(n => ({ ...n, read: true })));
  }

  markRead(id: number) {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }
}