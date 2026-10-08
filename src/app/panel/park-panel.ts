import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  input,
  viewChild,
  viewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Park } from '../data/park';
import { ParkImage } from './park-image';

@Component({
  selector: 'app-park-panel',
  imports: [RouterLink, ParkImage],
  templateUrl: './park-panel.html',
  styleUrl: './park-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParkPanel {
  readonly parks = input.required<Park[]>();
  readonly loading = input.required<boolean>();
  readonly error = input.required<string | null>();
  /** Undefined means list mode. */
  readonly selectedId = input<string>();

  protected readonly selected = computed(() => {
    const id = this.selectedId();
    return id === undefined ? undefined : this.parks().find((park) => park.id === id);
  });

  private readonly listHeading = viewChild<ElementRef<HTMLHeadingElement>>('listHeading');
  private readonly detailsHeading = viewChild<ElementRef<HTMLHeadingElement>>('detailsHeading');
  private readonly parkLinks = viewChildren<ElementRef<HTMLAnchorElement>>('parkLink');

  /** The id the focus effect last acted on; plain fields so writing them never re-runs it. */
  private lastFocusedId: string | undefined;
  /** The park whose link gets focus back when the list returns. */
  private lastOpenedId: string | undefined;

  constructor() {
    afterRenderEffect(() => {
      const id = this.selectedId();
      const detailsHeading = this.detailsHeading();
      const listHeading = this.listHeading();
      const links = this.parkLinks();

      if (id !== undefined) {
        // A re-run with the same id (for example a viewChild signal change) must not re-steal focus.
        if (id !== this.lastFocusedId && detailsHeading) {
          detailsHeading.nativeElement.focus();
          this.lastFocusedId = id;
          this.lastOpenedId = id;
        }
        return;
      }

      // Back in list mode after a details view: restore focus to the park link.
      if (this.lastFocusedId === undefined) {
        return;
      }
      const link = links.find((ref) => ref.nativeElement.dataset['parkId'] === this.lastOpenedId);
      const target = link?.nativeElement ?? listHeading?.nativeElement;
      if (target) {
        target.focus();
        this.lastFocusedId = undefined;
      }
    });
  }
}
