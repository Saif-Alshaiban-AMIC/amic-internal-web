import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth-service';
import { DeptLabelPipe } from '../../../pipes/department-label.pipe';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule , DeptLabelPipe],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  phoneNumber = '';
  department: string = '';
  jobTitle = '';
  showPassword = false;

  // Populate from your Department enum values
  departments = ["HR",
    "IT",
    "SALES",
    "MARKETING",
    "FINANCE",
    "OPERATIONS",
    "PROCUREMENT",
    "LEGAL",
    "CUSTOMER_SERVICE",];

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }
  isLoading = false;
  errorMessage = '';
  onSubmit() {
    this.authService.register({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      department: this.department,
      jobTitle: this.jobTitle
    }).subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Something went wrong. Please try again.';
        this.isLoading = false;
      }
    });
  }
}