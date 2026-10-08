import { ChangeDetectionStrategy, Component, input, linkedSignal } from '@angular/core';

@Component({
  selector: 'app-park-image',
  templateUrl: './park-image.html',
  styleUrl: './park-image.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParkImage {
  readonly src = input.required<string | null>();
  readonly alt = input.required<string>();

  protected readonly state = linkedSignal<'loading' | 'loaded' | 'error'>(() =>
    this.src() === null ? 'error' : 'loading',
  );
}
