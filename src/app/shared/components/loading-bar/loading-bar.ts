import { Component } from '@angular/core';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-loading-bar',
  standalone: true,
  template: `
    @if (loading.isLoading()) {
      <div class="loading-bar">
        <div class="loading-bar__track"></div>
      </div>
    }
  `,
  styleUrl: './loading-bar.scss'
})
export class LoadingBarComponent {
  constructor(readonly loading: LoadingService) {}
}
