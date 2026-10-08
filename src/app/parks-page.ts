import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ParksService } from './data/parks-service';
import { ParkPanel } from './panel/park-panel';

@Component({
  selector: 'app-parks-page',
  imports: [ParkPanel],
  templateUrl: './parks-page.html',
  styleUrl: './parks-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParksPage {
  /** Bound from the route by withComponentInputBinding; undefined on /parks. */
  readonly id = input<string>();

  private readonly parksService = inject(ParksService);
  protected readonly parks = this.parksService.parks;
  protected readonly loading = this.parksService.loading;
  protected readonly error = this.parksService.error;
}
