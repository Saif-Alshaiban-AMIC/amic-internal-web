import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth-service';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink, MatIconModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPasswordComponent {

  email   = '';
  sent    = false;
  loading = false;
  error   = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (!this.email) return;
    this.loading = true;
    this.error   = '';

    this.authService.forgotPassword(this.email).subscribe({
      next:  () => { this.loading = false; this.sent = true; },
      error: () => { this.loading = false; this.error = 'Something went wrong. Please try again.'; }
    });
  }
}
