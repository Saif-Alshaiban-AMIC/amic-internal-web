import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';
import { NotificationsPanel } from '../../shared/components/notifications-panel/notifications-panel';
import { LoadingBarComponent } from '../../shared/components/loading-bar/loading-bar';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Topbar, NotificationsPanel, LoadingBarComponent],
  templateUrl: './shell.html',
  styleUrl: './shell.scss'
})
export class Shell {
  readonly sidebarCollapsed = signal(false);
  readonly showNotifications = signal(false);

  toggleSidebar() { this.sidebarCollapsed.update(v => !v); }
  toggleNotifications() { this.showNotifications.update(v => !v); }
}