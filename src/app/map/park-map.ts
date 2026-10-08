import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewEncapsulation,
  afterNextRender,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  LeafletKeyboardEvent,
  Map as LeafletMap,
  Marker,
  divIcon,
  latLngBounds,
  map,
  marker,
  tileLayer,
} from 'leaflet';
import { Park } from '../data/park';

const SELECTED_Z_OFFSET = 1000;

interface CameraRequest {
  leafletMap: LeafletMap;
  markers: Map<string, Marker>;
  selected: Marker | undefined;
  offset: number;
}

const pinIcon = divIcon({
  className: 'park-pin',
  html:
    '<svg aria-hidden="true" width="28" height="40" viewBox="0 0 28 40">' +
    '<path fill="currentColor" d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.3 21.7 0 14 0zm0 19a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>' +
    '</svg>',
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  tooltipAnchor: [0, -36],
});

@Component({
  selector: 'app-park-map',
  templateUrl: './park-map.html',
  styleUrl: './park-map.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'park-map' },
})
export class ParkMap {
  readonly parks = input.required<Park[]>();
  readonly selectedId = input<string | undefined>();
  readonly centerOffset = input(0);
  /** A change refits the map to every park when nothing is selected (the Recenter button). */
  readonly fitRequest = input(0);
  readonly select = output<string>();

  private readonly container = viewChild.required<ElementRef<HTMLDivElement>>('container');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly leafletMap = signal<LeafletMap | undefined>(undefined);
  private readonly markers = signal<Map<string, Marker>>(new Map());
  private selectedMarker: Marker | undefined;
  /** True only while a Leaflet zoom animation runs; set and cleared by zoomstart and zoomend. */
  private zooming = false;
  /** The latest camera request, held until a running zoom animation ends. */
  private pending: CameraRequest | undefined;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const leafletMap = map(this.container().nativeElement);
      // Leaflet drops camera calls made mid-animation, so hold the latest one until zoomend.
      // These handlers touch only Leaflet and plain fields, so no signal write is needed.
      leafletMap.on('zoomstart', () => {
        this.zooming = true;
      });
      leafletMap.on('zoomend', () => {
        this.zooming = false;
        const request = this.pending;
        this.pending = undefined;
        if (request) {
          this.applyCamera(request);
        }
      });
      leafletMap.attributionControl.setPosition('topright');
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(leafletMap);
      leafletMap.invalidateSize();

      const observer =
        typeof ResizeObserver !== 'undefined'
          ? new ResizeObserver(() => leafletMap.invalidateSize())
          : undefined;
      observer?.observe(this.host.nativeElement);

      destroyRef.onDestroy(() => {
        observer?.disconnect();
        leafletMap.remove();
      });
      this.leafletMap.set(leafletMap);
    });

    effect((onCleanup) => {
      const leafletMap = this.leafletMap();
      if (!leafletMap) {
        return;
      }
      const markers = this.buildMarkers(leafletMap, this.parks());
      this.markers.set(markers);
      onCleanup(() => markers.forEach((m) => m.remove()));
    });

    effect(() => {
      const leafletMap = this.leafletMap();
      const markers = this.markers();
      const selected = markers.get(this.selectedId() ?? '');
      const offset = this.centerOffset();
      this.fitRequest();
      if (!leafletMap || markers.size === 0) {
        return;
      }
      this.moveCamera({ leafletMap, markers, selected, offset });
      this.markSelected(selected);
    });
  }

  private buildMarkers(leafletMap: LeafletMap, parks: Park[]): Map<string, Marker> {
    const markers = new Map<string, Marker>();
    for (const park of parks) {
      if (!park.coordinates) {
        continue;
      }
      const label = document.createElement('span');
      label.textContent = park.name;
      const m = marker(park.coordinates, {
        icon: pinIcon,
        title: park.name,
        alt: park.name,
        keyboard: true,
      }).bindTooltip(label, { direction: 'top' });
      // Leaflet adds a marker only once the map has a view, so the element is labelled on add.
      m.on('add', () => m.getElement()?.setAttribute('aria-label', park.name));
      m.on('click', () => this.select.emit(park.id));
      // Leaflet maps Enter to click only for markers with a popup, so handle Enter and Space here.
      m.on('keypress', (e: LeafletKeyboardEvent) => {
        const event = e.originalEvent;
        const space = event.key === ' ' || event.keyCode === 32;
        if (space) {
          event.preventDefault(); // keeps the page from scrolling
        }
        if (space || event.keyCode === 13) {
          this.select.emit(park.id);
        }
      });
      m.addTo(leafletMap);
      markers.set(park.id, m);
    }
    return markers;
  }

  private moveCamera(request: CameraRequest): void {
    this.pending = request;
    if (this.zooming) {
      return;
    }
    this.pending = undefined;
    this.applyCamera(request);
  }

  private applyCamera({ leafletMap, markers, selected, offset }: CameraRequest): void {
    const animate = !(
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    if (selected) {
      const point = leafletMap.project(selected.getLatLng(), 15).add([0, offset / 2]);
      leafletMap.setView(leafletMap.unproject(point, 15), 15, { animate });
    } else {
      const bounds = latLngBounds([...markers.values()].map((m) => m.getLatLng()));
      // animate: false because Leaflet drops fitBounds/setView calls that land while a zoom
      // animation is running (_tryAnimatedZoom returns true while _animatingZoom is set), which
      // left the map zoomed out after the sheet resized. List <-> park moves never animated
      // anyway: the zoom change exceeds Leaflet's 4-level zoomAnimationThreshold.
      leafletMap.fitBounds(bounds, {
        paddingTopLeft: [24, 40],
        paddingBottomRight: [24, 24 + offset],
        animate: false,
      });
    }
  }

  private markSelected(selected: Marker | undefined): void {
    if (this.selectedMarker && this.selectedMarker !== selected) {
      this.selectedMarker.getElement()?.classList.remove('is-selected');
      this.selectedMarker.getElement()?.removeAttribute('aria-current');
      this.selectedMarker.setZIndexOffset(0);
    }
    selected?.getElement()?.classList.add('is-selected');
    selected?.getElement()?.setAttribute('aria-current', 'true');
    selected?.setZIndexOffset(SELECTED_Z_OFFSET);
    this.selectedMarker = selected;
  }
}
