import { Component, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProfileService, ProfileUpdateRequest, UserProfile } from '../../../services/profile-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  readonly editing = signal(false);
  readonly loading = signal(true);
  readonly saving  = signal(false);
  readonly error   = signal<string | null>(null);

  readonly user = signal<UserProfile | null>(null);

  readonly initials = computed(() => {
    const u = this.user();
    return u ? `${u.firstName[0]}${u.lastName[0]}` : '';
  });

  draft: ProfileUpdateRequest = { firstName: '', lastName: '', phoneNumber: '' };

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe({
      next:  (u) => { this.user.set(u); this.loading.set(false); },
      error: (e) => { console.log(e); this.loading.set(false); }
    });
  }

  startEdit() {
    const u = this.user()!;
    this.draft = { firstName: u.firstName, lastName: u.lastName, phoneNumber: u.phoneNumber };
    this.editing.set(true);
  }

  save() {
    this.saving.set(true);
    this.profileService.updateProfile(this.draft).subscribe({
      next: (updated) => {
        this.user.set(updated);
        this.editing.set(false);
        this.saving.set(false);
      },
      error: (e) => {
        console.error('Failed to update profile', e);
        this.error.set(e);
        this.saving.set(false);
      }
    });
  }

  cancel() {
    this.editing.set(false);
    this.error.set(null);
  }
}