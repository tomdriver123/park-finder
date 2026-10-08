import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ParksService } from './data/parks-service';
import { ParkMap } from './map/park-map';
import { ParkPanel } from './panel/park-panel';

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

  protected onSelect(id: string): void {
    void this.router.navigate(['/parks', id]);
  }
}
