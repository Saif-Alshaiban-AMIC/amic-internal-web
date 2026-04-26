import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { RouterLink }      from '@angular/router';
import { MatIconModule }   from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { ProfileService, UserProfile } from '../../services/profile-service';

interface QuickLink {
  labelKey: string;
  icon:     string;
  route:    string;
  color:    string;
}

interface Announcement {
  titleKey: string;
  bodyKey:  string;
  tagKey:   string;
  icon:     string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, TranslateModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  // ── User ────────────────────────────────────────────────────────────────
  profile = signal<UserProfile | null>(null);

  firstName = computed(() => this.profile()?.firstName ?? '');

  // ── Greeting ────────────────────────────────────────────────────────────
  greetingKey = computed<string>(() => {
    const h = new Date().getHours();
    if (h < 12) return 'HOME.GREETING_MORNING';
    if (h < 17) return 'HOME.GREETING_AFTERNOON';
    return 'HOME.GREETING_EVENING';
  });

  today = new Date();

  // ── Quick-access links ──────────────────────────────────────────────────
  readonly quickLinks: QuickLink[] = [
    { labelKey: 'NAV.HR',              icon: 'people',          route: '/hr',               color: '#4A90D9' },
    { labelKey: 'NAV.IT',              icon: 'computer',        route: '/it',               color: '#7B68EE' },
    { labelKey: 'NAV.FINANCE',         icon: 'account_balance', route: '/finance',          color: '#3CB371' },
    { labelKey: 'NAV.PROCUREMENT',     icon: 'shopping_cart',   route: '/procurement',      color: '#E8973A' },
    { labelKey: 'NAV.POLICIES',        icon: 'description',     route: '/policies',         color: '#E05C5C' },
    { labelKey: 'NAV.SERVICE_DESK',    icon: 'support_agent',   route: '/service-disk',     color: '#20B2AA' },
    { labelKey: 'NAV.IMPORTANT_LINKS', icon: 'link',            route: '/important-links',  color: '#9B59B6' },
  ];

  // ── Announcements ───────────────────────────────────────────────────────
  readonly announcements: Announcement[] = [
    { titleKey: 'HOME.ANN_1_TITLE', bodyKey: 'HOME.ANN_1_BODY', tagKey: 'HOME.TAG_MAINT',  icon: 'build_circle' },
    { titleKey: 'HOME.ANN_2_TITLE', bodyKey: 'HOME.ANN_2_BODY', tagKey: 'HOME.TAG_HR',     icon: 'schedule'     },
    { titleKey: 'HOME.ANN_3_TITLE', bodyKey: 'HOME.ANN_3_BODY', tagKey: 'HOME.TAG_HR',     icon: 'star_rate'    },
    { titleKey: 'HOME.ANN_4_TITLE', bodyKey: 'HOME.ANN_4_BODY', tagKey: 'HOME.TAG_POLICY', icon: 'policy'       },
  ];

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: p  => this.profile.set(p),
      error: () => { /* silently fail — greeting will just omit the name */ }
    });
  }
}
