import { Component, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../services/auth-service';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, MatBadgeModule, MatSlideToggleModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class Topbar {
  readonly toggleSidebar = output<void>();
  readonly toggleNotifications = output<void>();


  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    translate.setDefaultLang('en');

  }


  currentLang = 'en';
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {


      const lang = localStorage.getItem('lang') || 'en';
      this.translate.use(lang);
      document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }





  toggleLang(isArabic: boolean) {
    const lang = isArabic ? 'ar' : 'en';

    this.currentLang = lang;
    localStorage.setItem('lang', lang);

    this.translate.use(lang);

    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}