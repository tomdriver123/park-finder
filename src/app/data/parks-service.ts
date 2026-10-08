import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, inject, signal } from '@angular/core';
import { normalizeParks } from './normalize';
import { Park } from './park';

const LOAD_ERROR = 'Could not load parks.';

@Injectable({ providedIn: 'root' })
export class ParksService {
  private readonly http = inject(HttpClient);

  private readonly parksState = signal<Park[]>([]);
  private readonly loadingState = signal(true);
  private readonly errorState = signal<string | null>(null);

  readonly parks: Signal<Park[]> = this.parksState.asReadonly();
  readonly loading: Signal<boolean> = this.loadingState.asReadonly();
  readonly error: Signal<string | null> = this.errorState.asReadonly();

  constructor() {
    this.http.get<unknown>('/assets/parks.sample.json').subscribe({
      next: (body) => {
        try {
          this.parksState.set(normalizeParks(body));
          this.errorState.set(null);
        } catch {
          this.fail();
        }
        this.loadingState.set(false);
      },
      error: () => {
        this.fail();
        this.loadingState.set(false);
      },
    });
  }

  private fail(): void {
    this.parksState.set([]);
    this.errorState.set(LOAD_ERROR);
  }
}
