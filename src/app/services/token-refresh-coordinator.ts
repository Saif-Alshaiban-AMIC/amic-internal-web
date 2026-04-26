import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Holds the in-flight refresh state so the auth interceptor can queue
 * concurrent 401 responses instead of firing multiple refresh calls.
 * Kept in a proper Injectable so Angular DI manages its lifecycle cleanly.
 */
@Injectable({ providedIn: 'root' })
export class TokenRefreshCoordinator {
  isRefreshing = false;
  readonly refreshDone$ = new BehaviorSubject<string | null>(null);
}
