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

  email = '';
  password = '';
  showPassword = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  onSubmit() {
    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response: AuthResponse) => {
        this.authService.storeTokens(response);
        this.toast.success('Login successful');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.toast.error('Login failed');
        console.log(err);
      }
    });
  }
}