import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { DeptLabelPipe } from '../../pipes/department-label.pipe';
import { UserService, UserRecord, CreateUserPayload } from '../../services/user-service';
import { ToastService } from '../../services/toast-service';

interface ServiceCard {
  icon: string;
  titleKey: string;
  descKey: string;
  available: boolean;
}

@Component({
  selector: 'app-hr',
  standalone: true,
  imports: [FormsModule, DatePipe, MatIconModule, TranslateModule, DeptLabelPipe],
  templateUrl: './hr.html',
  styleUrl: './hr.scss'
})
export class Hr implements OnInit {

  // ── Tabs ──────────────────────────────────────────────────────────────────
  readonly activeTab = signal<'services' | 'users'>('services');

  // ── Services ──────────────────────────────────────────────────────────────
  readonly services: ServiceCard[] = [
    { icon: 'badge',            titleKey: 'HR.SVC_USER_MGT.TITLE',   descKey: 'HR.SVC_USER_MGT.DESC',   available: true  },
    { icon: 'event_available',  titleKey: 'HR.SVC_LEAVE.TITLE',      descKey: 'HR.SVC_LEAVE.DESC',      available: false },
    { icon: 'person_add',       titleKey: 'HR.SVC_ONBOARDING.TITLE', descKey: 'HR.SVC_ONBOARDING.DESC', available: false },
    { icon: 'star_rate',        titleKey: 'HR.SVC_PERF.TITLE',       descKey: 'HR.SVC_PERF.DESC',       available: false },
    { icon: 'school',           titleKey: 'HR.SVC_TRAINING.TITLE',   descKey: 'HR.SVC_TRAINING.DESC',   available: false },
    { icon: 'payments',         titleKey: 'HR.SVC_PAYROLL.TITLE',    descKey: 'HR.SVC_PAYROLL.DESC',    available: false },
  ];

  openService(card: ServiceCard) {
    if (!card.available) return;
    if (card.titleKey === 'HR.SVC_USER_MGT.TITLE') this.activeTab.set('users');
  }

  // ── User Management ───────────────────────────────────────────────────────
  readonly users    = signal<UserRecord[]>([]);
  readonly loading  = signal(true);
  readonly saving   = signal(false);
  readonly showForm = signal(false);
  readonly search   = signal('');

  readonly filtered = computed(() => {
    const q = this.search().toLowerCase();
    if (!q) return this.users();
    return this.users().filter(u =>
      `${u.firstName} ${u.lastName} ${u.email} ${u.department} ${u.jobTitle}`
        .toLowerCase().includes(q)
    );
  });

  form: CreateUserPayload = this.emptyForm();
  formErrorKey = '';

  readonly departments = [
    'HUMAN_RESOURCES', 'IT_MIS', 'FINANCE', 'BUSINESS_DEVELOPMENT',
    'BUSINESS_PROCESS', 'CONTRACTS_COMPLIANCE', 'ENGINEERING_RD',
    'EXECUTIVE', 'IPP', 'PROJECTS', 'SUPPLY_CHAIN',
  ];

  constructor(
    private userService: UserService,
    private toast: ToastService
  ) {}

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.loading.set(true);
    this.userService.getAll().subscribe({
      next: users => { this.users.set(users); this.loading.set(false); },
      error: ()    => { this.loading.set(false); }
    });
  }

  openForm() {
    this.form = this.emptyForm();
    this.formErrorKey = '';
    this.showForm.set(true);
  }

  closeForm() { this.showForm.set(false); }

  submit() {
    if (!this.form.firstName || !this.form.lastName || !this.form.email || !this.form.password) {
      this.formErrorKey = 'USER_FORM.ERR_REQUIRED';
      return;
    }
    if (!this.form.email.toLowerCase().endsWith('@alkhorayef.com')) {
      this.formErrorKey = 'USER_FORM.ERR_DOMAIN';
      return;
    }
    this.formErrorKey = '';
    this.saving.set(true);

    this.userService.create(this.form).subscribe({
      next: created => {
        this.users.update(list => [created, ...list]);
        this.saving.set(false);
        this.showForm.set(false);
        this.toast.success(`${created.firstName} ${created.lastName} added successfully`);
      },
      error: err => {
        this.saving.set(false);
        this.formErrorKey = err.status === 409 ? 'USER_FORM.ERR_DUPLICATE' : 'USER_FORM.ERR_GENERIC';
      }
    });
  }

  remove(user: UserRecord) {
    if (!confirm(`Remove ${user.firstName} ${user.lastName}?`)) return;
    this.userService.delete(user.id).subscribe({
      next: () => this.users.update(list => list.filter(u => u.id !== user.id)),
      error: () => {}
    });
  }

  initials(u: UserRecord) {
    return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase();
  }

  private emptyForm(): CreateUserPayload {
    return { firstName: '', lastName: '', email: '', password: '',
             phoneNumber: '', department: '', jobTitle: '', role: 'USER' };
  }
}
