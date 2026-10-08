import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ParksService } from './data/parks-service';
import { ParkMap } from './map/park-map';
import { ParkPanel } from './panel/park-panel';

// Keep in sync with the 768px breakpoint in parks-page.css
const MOBILE_QUERY = '(max-width: 767.98px)';

@Component({
  selector: 'app-parks-page',
  imports: [ParkPanel, ParkMap],
  templateUrl: './parks-page.html',
  styleUrl: './parks-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParksPage {
  /** Bound from the route by withComponentInputBinding; undefined on /parks. */
  readonly id = input<string>();

  private readonly parksService = inject(ParksService);
  private readonly router = inject(Router);
  protected readonly parks = this.parksService.parks;
  protected readonly loading = this.parksService.loading;
  protected readonly error = this.parksService.error;

  /** Selecting a park expands the sheet, the list collapses it; the toggle overrides until the next navigation. */
  protected readonly expanded = linkedSignal({
    source: this.id,
    computation: (id) => id !== undefined,
  });
  protected readonly isMobile = signal(false);
  private readonly sheetHeight = signal(0);
  protected readonly centerOffset = computed(() => (this.isMobile() ? this.sheetHeight() : 0));

  private readonly sheet = viewChild.required<ElementRef<HTMLElement>>('sheet');

  constructor() {
    const destroyRef = inject(DestroyRef);

    if (typeof matchMedia === 'function') {
      const query = matchMedia(MOBILE_QUERY);
      this.isMobile.set(query.matches);
      const onChange = (event: MediaQueryListEvent): void => this.isMobile.set(event.matches);
      query.addEventListener('change', onChange);
      destroyRef.onDestroy(() => query.removeEventListener('change', onChange));
    }

    afterNextRender(() => {
      if (typeof ResizeObserver === 'undefined') {
        return;
      }
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          this.sheetHeight.set(entry.contentRect.height);
        }
      });
      observer.observe(this.sheet().nativeElement);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected toggleSheet(): void {
    this.expanded.update((value) => !value);
  }

  /** A marker reached by Tab must not sit behind the expanded sheet. */
  protected onMapFocusIn(): void {
    if (this.isMobile()) {
      this.expanded.set(false);
    }
  }

  protected onSelect(id: string): void {
    void this.router.navigate(['/parks', id]);
  }
}
