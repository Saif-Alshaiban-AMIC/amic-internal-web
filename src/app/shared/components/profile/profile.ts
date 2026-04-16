import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  readonly editing = signal(false);

  readonly user = signal({
    firstName: 'Ahmad',
    lastName: 'Hassan',
    email: 'a.hassan@company.com',
    phone: '+966 50 000 0000',
    department: 'IT',
    jobTitle: 'Senior Engineer',
    joinDate: 'Jan 12, 2022',
  });

  readonly initials = computed(() => {
    const u = this.user();
    return `${u.firstName[0]}${u.lastName[0]}`;
  });

  // Draft copy for editing so we don't mutate live signal directly
  draft = { ...this.user() };

  startEdit() {
    this.draft = { ...this.user() };
    this.editing.set(true);
  }

  save() {
    this.user.set({ ...this.draft });
    this.editing.set(false);
  }

  cancel() {
    this.editing.set(false);
  }
}