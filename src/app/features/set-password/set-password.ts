import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth-service';

@Component({
  standalone: true,
  selector: 'app-set-password',
  imports: [FormsModule, RouterLink, MatIconModule],
  templateUrl: './set-password.html',
  styleUrl: './set-password.scss'
})
export class SetPasswordComponent implements OnInit {

  token       = '';
  isWelcome   = false;   // true when coming from a new-account welcome email

  newPassword     = '';
  confirmPassword = '';
  showNew         = false;
  showConfirm     = false;

  loading = false;
  done    = false;
  error   = '';

  constructor(
    private route:       ActivatedRoute,
    private router:      Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.token     = this.route.snapshot.queryParamMap.get('token')     ?? '';
    this.isWelcome = this.route.snapshot.queryParamMap.get('welcome') === 'true';

    if (!this.token) {
      this.error = 'Invalid or missing setup link. Please request a new one.';
    }
  }

  get heading() {
    return this.isWelcome ? 'Set up your account' : 'Choose a new password';
  }

  get subtitle() {
    return this.isWelcome
      ? 'Welcome! Create a password to activate your account.'
      : 'Enter a new password for your account.';
  }

  get ctaLabel() {
    return this.loading
      ? 'Saving…'
      : (this.isWelcome ? 'Activate account' : 'Reset password');
  }

  onSubmit() {
    this.error = '';

    if (!this.newPassword || !this.confirmPassword) {
      this.error = 'Please fill in both fields.';
      return;
    }
    if (this.newPassword.length < 8) {
      this.error = 'Password must be at least 8 characters.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.loading = true;

    this.authService.setPassword(this.token, this.newPassword).subscribe({
      next:  () => { this.loading = false; this.done = true; },
      error: () => {
        this.loading = false;
        this.error   = 'This link has expired or is invalid. Please request a new one.';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
