import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPasswordComponent {

  email = '';
  message = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post(
      `http://localhost:8080/auth/forgot-password?email=${this.email}`,
      {},
      { responseType: 'text' }
    ).subscribe({
      next: (res) => this.message = res,
      error: (e) => console.error(e)
    });
  }
}