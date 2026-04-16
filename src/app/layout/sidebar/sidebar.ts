import { Component, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule, TranslateModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  readonly collapsed = input<boolean>(false);

  currentLang = signal<'en' | 'ar'>('en');

  readonly navItems: NavItem[] = [
    { label: 'NAV.DASHBOARD', icon: 'dashboard', route: '/dashboard' },
    { label: 'NAV.HR', icon: 'people', route: '/hr' },
    { label: 'NAV.IT', icon: 'computer', route: '/it' },
    { label: 'NAV.FINANCE', icon: 'account_balance', route: '/finance' },
    { label: 'NAV.PROCUREMENT', icon: 'shopping_cart', route: '/procurement' },
    { label: 'NAV.POLICIES', icon: 'description', route: '/policies' },
    { label: 'NAV.SERVICE_DESK', icon: 'storage', route: '/service-disk' },
    { label: 'NAV.IMPORTANT_LINKS', icon: 'link', route: '/important-links' },
  ];

  constructor(private translate: TranslateService) {
    const saved = (localStorage.getItem('lang') as 'en' | 'ar') || 'en';
    this.setLang(saved);
  }

  setLang(lang: 'en' | 'ar') {
    this.translate.use(lang);
    this.currentLang.set(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  toggleLang() {
    this.setLang(this.currentLang() === 'en' ? 'ar' : 'en');
  }
}