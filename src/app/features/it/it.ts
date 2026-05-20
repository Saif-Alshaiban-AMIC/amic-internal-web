import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { DevRequestService, DevRequest, CreateDevRequestPayload, UpdateDevRequestPayload } from '../../services/dev-request-service';
import { ToastService } from '../../services/toast-service';

interface ServiceCard { icon: string; titleKey: string; descKey: string; available: boolean; }

@Component({
  selector: 'app-it',
  standalone: true,
  imports: [FormsModule, DatePipe, TitleCasePipe, MatIconModule, TranslateModule],
  templateUrl: './it.html',
  styleUrl: './it.scss'
})
export class It implements OnInit {

  // ── Tabs ──────────────────────────────────────────────────────────────────
  readonly activeTab = signal<'services' | 'requests'>('services');

  // ── Services ──────────────────────────────────────────────────────────────
  readonly services: ServiceCard[] = [
    { icon: 'support_agent',    titleKey: 'IT.SVC_SUPPORT.TITLE',   descKey: 'IT.SVC_SUPPORT.DESC',   available: false },
    { icon: 'devices',          titleKey: 'IT.SVC_EQUIPMENT.TITLE',  descKey: 'IT.SVC_EQUIPMENT.DESC', available: false },
    { icon: 'lock_open',        titleKey: 'IT.SVC_ACCESS.TITLE',    descKey: 'IT.SVC_ACCESS.DESC',    available: false },
    { icon: 'app_registration', titleKey: 'IT.SVC_LICENSE.TITLE',   descKey: 'IT.SVC_LICENSE.DESC',   available: false },
    { icon: 'wifi',             titleKey: 'IT.SVC_NETWORK.TITLE',   descKey: 'IT.SVC_NETWORK.DESC',   available: false },
    { icon: 'security',         titleKey: 'IT.SVC_SECURITY.TITLE',  descKey: 'IT.SVC_SECURITY.DESC',  available: false },
    { icon: 'code',             titleKey: 'IT.SVC_DEVREQ.TITLE',    descKey: 'IT.SVC_DEVREQ.DESC',    available: true  },
  ];

  openService(card: ServiceCard) {
    if (!card.available) return;
    if (card.titleKey === 'IT.SVC_DEVREQ.TITLE') this.activeTab.set('requests');
  }

  // ── Requests list ─────────────────────────────────────────────────────────
  readonly requests  = signal<DevRequest[]>([]);
  readonly loading   = signal(true);
  readonly saving    = signal(false);
  readonly search    = signal('');

  readonly filtered = computed(() => {
    const q = this.search().toLowerCase();
    if (!q) return this.requests();
    return this.requests().filter(r =>
      `${r.requesterName} ${r.requesterEmail} ${r.appName} ${r.department} ${r.status}`
        .toLowerCase().includes(q)
    );
  });

  // ── Priority / Type / Status options ─────────────────────────────────────
  readonly appTypes  = ['WEB_APP', 'MOBILE_APP', 'DESKTOP_APP', 'API_INTEGRATION', 'DASHBOARD', 'OTHER'];
  readonly priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  readonly statuses   = ['PENDING', 'IN_REVIEW', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'];

  readonly departments = [
    'HUMAN_RESOURCES', 'IT_MIS', 'FINANCE', 'BUSINESS_DEVELOPMENT',
    'BUSINESS_PROCESS', 'CONTRACTS_COMPLIANCE', 'ENGINEERING_RD',
    'EXECUTIVE', 'IPP', 'PROJECTS', 'SUPPLY_CHAIN',
  ];

  // ── New request form ──────────────────────────────────────────────────────
  readonly showForm = signal(false);
  form: CreateDevRequestPayload = this.emptyForm();
  formError = '';

  // ── Detail / edit drawer ──────────────────────────────────────────────────
  readonly showDetail  = signal(false);
  readonly selected    = signal<DevRequest | null>(null);
  editStatus = '';
  editNotes  = '';

  constructor(
    private devRequestService: DevRequestService,
    private toast: ToastService
  ) {}

  ngOnInit() { this.loadRequests(); }

  loadRequests() {
    this.loading.set(true);
    this.devRequestService.getAll().subscribe({
      next:  list => { this.requests.set(list); this.loading.set(false); },
      error: ()   => { this.loading.set(false); }
    });
  }

  // ── New request ───────────────────────────────────────────────────────────

  openForm() {
    this.form = this.emptyForm();
    this.formError = '';
    this.showForm.set(true);
  }

  closeForm() { this.showForm.set(false); }

  submit() {
    if (!this.form.requesterName || !this.form.requesterEmail ||
        !this.form.appName || !this.form.appType || !this.form.description) {
      this.formError = 'DEV_REQUEST.ERR_REQUIRED';
      return;
    }
    this.formError = '';
    this.saving.set(true);

    this.devRequestService.create(this.form).subscribe({
      next: created => {
        this.requests.update(list => [created, ...list]);
        this.saving.set(false);
        this.showForm.set(false);
        this.toast.success('Request submitted successfully');
      },
      error: () => {
        this.saving.set(false);
        this.formError = 'DEV_REQUEST.ERR_GENERIC';
      }
    });
  }

  // ── Detail / update ───────────────────────────────────────────────────────

  openDetail(r: DevRequest) {
    this.selected.set(r);
    this.editStatus = r.status;
    this.editNotes  = r.notes ?? '';
    this.showDetail.set(true);
  }

  closeDetail() { this.showDetail.set(false); this.selected.set(null); }

  saveDetail() {
    const r = this.selected();
    if (!r) return;
    this.saving.set(true);

    const payload: UpdateDevRequestPayload = { status: this.editStatus, notes: this.editNotes };

    this.devRequestService.update(r.id, payload).subscribe({
      next: updated => {
        this.requests.update(list => list.map(x => x.id === updated.id ? updated : x));
        this.saving.set(false);
        this.showDetail.set(false);
        this.toast.success('Request updated');
      },
      error: () => { this.saving.set(false); }
    });
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  remove(r: DevRequest, event: Event) {
    event.stopPropagation();
    if (!confirm(`Delete request "${r.appName}"?`)) return;
    this.devRequestService.delete(r.id).subscribe({
      next: () => this.requests.update(list => list.filter(x => x.id !== r.id)),
      error: () => {}
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  priorityClass(p: string) {
    return { LOW: 'pri-low', MEDIUM: 'pri-medium', HIGH: 'pri-high', CRITICAL: 'pri-critical' }[p] ?? '';
  }

  statusClass(s: string) {
    return {
      PENDING: 'st-pending', IN_REVIEW: 'st-review', APPROVED: 'st-approved',
      IN_PROGRESS: 'st-progress', COMPLETED: 'st-done', REJECTED: 'st-rejected'
    }[s] ?? '';
  }

  formatType(t: string) {
    return t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  private emptyForm(): CreateDevRequestPayload {
    return {
      requesterName: '', requesterEmail: '', department: '',
      appName: '', appType: '', description: '', priority: 'MEDIUM', targetDate: null
    };
  }
}
