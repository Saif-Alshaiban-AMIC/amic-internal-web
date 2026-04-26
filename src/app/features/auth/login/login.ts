import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, AuthResponse } from '../../../services/auth-service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastService } from '../../../services/toast-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, MatSnackBarModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  email        = '';
  password     = '';
  showPassword = false;
  errorMsg     = '';
  loading      = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  onSubmit() {
    if (!this.email || !this.password) return;
    this.errorMsg = '';
    this.loading  = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response: AuthResponse) => {
        this.loading = false;

        // First-login: user must set their own password before getting tokens
        if (response.mustChangePassword) {
          this.router.navigate(['/auth/set-password'], {
            queryParams: { token: response.setupToken, welcome: true }
          });
          return;
        }

        this.authService.storeTokens(response);
        this.toast.success('Login successful');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading  = false;
        this.errorMsg = err.status === 429
          ? 'Too many failed attempts. Please wait 10 minutes.'
          : 'Invalid email or password.';
      }
    });
  }
}
