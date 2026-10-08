import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Map as LeafletMap } from 'leaflet';
import sample from '../../../public/assets/parks.sample.json';
import { normalizePark, normalizeParks } from '../data/normalize';
import { Park } from '../data/park';
import { ParkMap } from './park-map';

const sampleParks = normalizeParks(sample);

// Leaflet's public init hook hands the test each map ParkMap creates, without reaching into it.
let lastMap: LeafletMap | undefined;
LeafletMap.addInitHook(function (this: LeafletMap) {
  lastMap = this;
});

function edgePark(raw: Record<string, unknown>): Park {
  const park = normalizePark(raw);
  if (!park) {
    throw new Error('Edge row did not normalize');
  }
  return park;
}

const boldPark = edgePark({
  id: 'bold-park',
  name: '<b>Bold</b> Park',
  location: { lat: 40.7, lng: -73.95 },
});

const noCoordinatesPark = edgePark({ id: 'nowhere-park', name: 'Nowhere Park' });

async function render(parks: Park[]): Promise<ComponentFixture<ParkMap>> {
  await TestBed.configureTestingModule({ imports: [ParkMap] }).compileComponents();
  const fixture = TestBed.createComponent(ParkMap);
  fixture.componentRef.setInput('parks', parks);
  await fixture.whenStable();
  return fixture;
}

function pins(fixture: ComponentFixture<ParkMap>): HTMLElement[] {
  return Array.from(
    (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.park-pin'),
  );
}

function pinFor(fixture: ComponentFixture<ParkMap>, name: string): HTMLElement {
  const pin = pins(fixture).find((el) => el.getAttribute('title') === name);
  if (!pin) {
    throw new Error(`No pin for ${name}`);
  }
  return pin;
}

function emitted(fixture: ComponentFixture<ParkMap>): string[] {
  const ids: string[] = [];
  fixture.componentInstance.select.subscribe((id) => ids.push(id));
  return ids;
}

describe('ParkMap', () => {
  it('renders one keyboard-focusable, labelled pin per sample park', async () => {
    const fixture = await render(sampleParks);
    const all = pins(fixture);

    expect(all.length).toBe(12);
    for (const pin of all) {
      expect(pin.getAttribute('role')).toBe('button');
      expect(pin.getAttribute('tabindex')).toBe('0');
      expect(pin.getAttribute('title')).toBeTruthy();
      expect(pin.getAttribute('aria-label')).toBe(pin.getAttribute('title'));
    }
    const names = all.map((pin) => pin.getAttribute('aria-label'));
    expect(names).toEqual(expect.arrayContaining(sampleParks.map((park) => park.name)));

    const prospect = pinFor(fixture, 'Prospect Park');
    expect(prospect.getAttribute('aria-label')).toBe('Prospect Park');
  });

  it('shows a markup-like name as literal text, never as HTML', async () => {
    const fixture = await render([...sampleParks, boldPark]);
    const pin = pinFor(fixture, '<b>Bold</b> Park');

    pin.dispatchEvent(new FocusEvent('focus'));

    const tooltip = (fixture.nativeElement as HTMLElement).querySelector('.leaflet-tooltip');
    expect(tooltip?.textContent).toBe('<b>Bold</b> Park');
    expect(tooltip?.querySelector('b')).toBeNull();
    expect(pin.getAttribute('title')).toBe('<b>Bold</b> Park');
  });

  it('gives a park without coordinates no pin', async () => {
    const fixture = await render([...sampleParks, noCoordinatesPark]);

    expect(pins(fixture).length).toBe(12);
    expect(pins(fixture).some((pin) => pin.getAttribute('title') === 'Nowhere Park')).toBe(false);
  });

  it('moves the selected state between pins without re-adding them', async () => {
    const fixture = await render(sampleParks);
    const before = pins(fixture);
    const highland = pinFor(fixture, 'Highland Dog Park');
    const prospect = pinFor(fixture, 'Prospect Park');

    fixture.componentRef.setInput('selectedId', 'highland-dog-park');
    await fixture.whenStable();

    expect(highland.classList.contains('is-selected')).toBe(true);
    expect(highland.getAttribute('aria-current')).toBe('true');
    const selected = pins(fixture).filter((pin) => pin.classList.contains('is-selected'));
    expect(selected).toEqual([highland]);
    expect(pins(fixture).filter((pin) => pin.hasAttribute('aria-current'))).toEqual([highland]);

    fixture.componentRef.setInput('selectedId', 'prospect-park');
    await fixture.whenStable();

    expect(prospect.classList.contains('is-selected')).toBe(true);
    expect(prospect.getAttribute('aria-current')).toBe('true');
    expect(highland.classList.contains('is-selected')).toBe(false);
    expect(highland.hasAttribute('aria-current')).toBe(false);

    const after = pins(fixture);
    expect(after.length).toBe(12);
    after.forEach((pin, i) => expect(pin).toBe(before[i]));
  });

  it('emits the park id when a pin is clicked', async () => {
    const fixture = await render(sampleParks);
    const ids = emitted(fixture);

    pinFor(fixture, 'Prospect Park').dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(ids).toEqual(['prospect-park']);
  });

  it('emits the park id when Enter is pressed on a pin', async () => {
    const fixture = await render(sampleParks);
    const ids = emitted(fixture);

    pinFor(fixture, 'Highland Dog Park').dispatchEvent(
      new KeyboardEvent('keypress', { key: 'Enter', keyCode: 13, bubbles: true }),
    );

    expect(ids).toEqual(['highland-dog-park']);
  });

  it('shows the park name in a tooltip when a pin gets focus', async () => {
    const fixture = await render(sampleParks);

    pinFor(fixture, 'Prospect Park').dispatchEvent(new FocusEvent('focus'));

    const tooltip = (fixture.nativeElement as HTMLElement).querySelector(
      '[aria-label="Map of parks"] .leaflet-tooltip',
    );
    expect(tooltip?.textContent).toBe('Prospect Park');
  });

  it('emits the park id when Space is pressed on a pin', async () => {
    const fixture = await render(sampleParks);
    const ids = emitted(fixture);

    pinFor(fixture, 'Prospect Park').dispatchEvent(
      new KeyboardEvent('keypress', { key: ' ', keyCode: 32, bubbles: true, cancelable: true }),
    );

    expect(ids).toEqual(['prospect-park']);
  });

  it('marks the map container as a labelled region', async () => {
    const fixture = await render(sampleParks);
    const container = (fixture.nativeElement as HTMLElement).querySelector(
      '[aria-label="Map of parks"]',
    );

    expect(container?.getAttribute('role')).toBe('region');
  });

  it('leaves every pin unselected when a refit is requested with no selection', async () => {
    const fixture = await render(sampleParks);

    fixture.componentRef.setInput('fitRequest', 1);
    await fixture.whenStable();

    expect(pins(fixture).some((pin) => pin.classList.contains('is-selected'))).toBe(false);
  });

  it('applies a selection requested during a zoom animation once the zoom ends', async () => {
    const fixture = await render(sampleParks);
    const leafletMap = lastMap!;

    leafletMap.fire('zoomstart');
    fixture.componentRef.setInput('selectedId', 'highland-dog-park');
    await fixture.whenStable();
    leafletMap.fire('zoomend');

    expect(pinFor(fixture, 'Highland Dog Park').classList.contains('is-selected')).toBe(true);
    expect(leafletMap.getZoom()).toBe(15);
  });
});
