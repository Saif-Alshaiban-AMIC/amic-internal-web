import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe }    from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DeptLabelPipe } from '../../pipes/department-label.pipe';
import { UserService, UserRecord, CreateUserPayload, BulkCreateResult } from '../../services/user-service';
import { ToastService } from '../../services/toast-service';
import * as XLSX from 'xlsx';

interface ServiceCard {
  icon: string;
  titleKey: string;
  descKey: string;
  available: boolean;
  link?: string;
}

export interface BulkRow extends CreateUserPayload {
  _status: 'valid' | 'error';
  _error:  string;
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
    { icon: 'badge',           titleKey: 'HR.SVC_USER_MGT.TITLE',   descKey: 'HR.SVC_USER_MGT.DESC',   available: true  },
    { icon: 'event_available', titleKey: 'HR.SVC_LEAVE.TITLE',      descKey: 'HR.SVC_LEAVE.DESC',      available: false },
    { icon: 'person_add',      titleKey: 'HR.SVC_ONBOARDING.TITLE', descKey: 'HR.SVC_ONBOARDING.DESC', available: false },
    { icon: 'star_rate',       titleKey: 'HR.SVC_PERF.TITLE',       descKey: 'HR.SVC_PERF.DESC',       available: false },
    { icon: 'school',          titleKey: 'HR.SVC_TRAINING.TITLE',   descKey: 'HR.SVC_TRAINING.DESC',   available: false },
    { icon: 'payments',        titleKey: 'HR.SVC_PAYROLL.TITLE',    descKey: 'HR.SVC_PAYROLL.DESC',    available: false },
    { icon: 'badge_critical',  titleKey: 'HR.SVC_VISITORS.TITLE',   descKey: 'HR.SVC_VISITORS.DESC',   available: true, link: 'https://amic-visitors-web.onrender.com/admin' },
    { icon: 'report_problem', titleKey: 'HR.SVC_SPEAKSAFE.TITLE', descKey: 'HR.SVC_SPEAKSAFE.DESC',  available: true, link: 'https://ssamic.onrender.com/' },
  ];

  openService(card: ServiceCard) {
    if (!card.available) return;
    if (card.link) { window.open(card.link, '_blank', 'noopener,noreferrer'); return; }
    if (card.titleKey === 'HR.SVC_USER_MGT.TITLE') this.activeTab.set('users');
  }

  // ── User list ─────────────────────────────────────────────────────────────
  readonly users   = signal<UserRecord[]>([]);
  readonly loading = signal(true);
  readonly saving  = signal(false);
  readonly search  = signal('');

  readonly filtered = computed(() => {
    const q = this.search().toLowerCase();
    if (!q) return this.users();
    return this.users().filter(u =>
      `${u.firstName} ${u.lastName} ${u.email} ${u.department} ${u.jobTitle}`
        .toLowerCase().includes(q)
    );
  });

  // ── Single-user form ──────────────────────────────────────────────────────
  readonly showForm = signal(false);
  form: CreateUserPayload = this.emptyForm();
  formErrorKey = '';

  // ── Bulk upload ───────────────────────────────────────────────────────────
  readonly showBulk     = signal(false);
  readonly bulkRows     = signal<BulkRow[]>([]);
  readonly bulkUploading = signal(false);

  readonly validRows   = computed(() => this.bulkRows().filter(r => r._status === 'valid'));
  readonly invalidRows = computed(() => this.bulkRows().filter(r => r._status === 'error'));

  readonly departments = [
    'HUMAN_RESOURCES', 'IT_MIS', 'FINANCE', 'BUSINESS_DEVELOPMENT',
    'BUSINESS_PROCESS', 'CONTRACTS_COMPLIANCE', 'ENGINEERING_RD',
    'EXECUTIVE', 'IPP', 'PROJECTS', 'SUPPLY_CHAIN',
  ];

  constructor(
    private userService: UserService,
    private toast: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.loading.set(true);
    this.userService.getAll().subscribe({
      next:  users => { this.users.set(users); this.loading.set(false); },
      error: ()    => { this.loading.set(false); }
    });
  }

  // ── Single form ───────────────────────────────────────────────────────────

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

  // ── Bulk upload ───────────────────────────────────────────────────────────

  triggerFileInput() {
    const input = document.getElementById('bulk-file-input') as HTMLInputElement;
    input?.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data   = new Uint8Array(e.target!.result as ArrayBuffer);
      const wb     = XLSX.read(data, { type: 'array' });
      const ws     = wb.Sheets[wb.SheetNames[0]];
      const rows   = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: '' });

      const parsed: BulkRow[] = rows.map(row => {
        const email     = (row['email'] || row['Email'] || '').trim();
        const firstName = (row['firstName'] || row['First Name'] || '').trim();
        const lastName  = (row['lastName']  || row['Last Name']  || '').trim();
        const password  = (row['password']  || row['Password']   || '').trim();
        const dept      = (row['department'] || row['Department'] || '').trim().toUpperCase().replace(/ /g, '_');
        const jobTitle  = (row['jobTitle']  || row['Job Title']  || '').trim();
        const phone     = (row['phoneNumber'] || row['Phone']    || '').trim();
        const role      = ((row['role'] || row['Role'] || 'USER').trim().toUpperCase()) as 'USER' | 'ADMIN';

        let _status: 'valid' | 'error' = 'valid';
        let _error = '';

        if (!firstName || !lastName || !email || !password) {
          _status = 'error'; _error = this.translate.instant('USER_FORM.BULK_ERR_EMPTY');
        } else if (!email.toLowerCase().endsWith('@alkhorayef.com')) {
          _status = 'error'; _error = this.translate.instant('USER_FORM.BULK_ERR_DOMAIN');
        }

        return { firstName, lastName, email, password, phoneNumber: phone,
                 department: dept, jobTitle, role, _status, _error };
      });

      this.bulkRows.set(parsed);
      this.showBulk.set(true);

      // Reset the file input so the same file can be re-selected
      (event.target as HTMLInputElement).value = '';
    };
    reader.readAsArrayBuffer(file);
  }

  closeBulk() {
    this.showBulk.set(false);
    this.bulkRows.set([]);
  }

  confirmBulk() {
    const valid = this.validRows();
    if (!valid.length) return;

    this.bulkUploading.set(true);

    // Strip internal _status/_error before sending
    const payloads: CreateUserPayload[] = valid.map(({ _status, _error, ...rest }) => rest);

    this.userService.bulkCreate(payloads).subscribe({
      next: (result: BulkCreateResult) => {
        this.bulkUploading.set(false);
        this.closeBulk();
        this.loadUsers();
        const msg = this.translate.instant('USER_FORM.BULK_SUCCESS', {
          created: result.created,
          failed:  result.failed
        });
        this.toast.success(msg);
      },
      error: () => {
        this.bulkUploading.set(false);
        this.toast.success('Bulk import failed. Please try again.');
      }
    });
  }

  downloadTemplate() {
    const headers = [['firstName','lastName','email','password','phoneNumber','department','jobTitle','role']];
    const ws = XLSX.utils.aoa_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'amic_users_template.xlsx');
  }

  // ── Shared ────────────────────────────────────────────────────────────────

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
