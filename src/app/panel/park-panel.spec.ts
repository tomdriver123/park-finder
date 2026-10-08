import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import sample from '../../../public/assets/parks.sample.json';
import { normalizeParks } from '../data/normalize';
import { Park } from '../data/park';
import { pinColor } from '../map/pin-colors';
import { ParkPanel } from './park-panel';

const PARKS: Park[] = normalizeParks(sample);

const NOWHERE: Park = {
  id: 'nowhere-park',
  name: 'Nowhere Park',
  description: null,
  coordinates: null,
  address: null,
  amenities: [],
  hours: null,
  images: [],
  acreage: null,
  rating: null,
};

interface PanelInputs {
  parks?: Park[];
  loading?: boolean;
  error?: string | null;
  selectedId?: string;
}

async function render(inputs: PanelInputs = {}): Promise<ComponentFixture<ParkPanel>> {
  const fixture = TestBed.createComponent(ParkPanel);
  fixture.componentRef.setInput('parks', inputs.parks ?? PARKS);
  fixture.componentRef.setInput('loading', inputs.loading ?? false);
  fixture.componentRef.setInput('error', inputs.error ?? null);
  if (inputs.selectedId !== undefined) {
    fixture.componentRef.setInput('selectedId', inputs.selectedId);
  }
  await fixture.whenStable();
  return fixture;
}

function el(fixture: ComponentFixture<ParkPanel>): HTMLElement {
  return fixture.nativeElement as HTMLElement;
}

function text(node: Element | null | undefined): string {
  return node?.textContent?.trim() ?? '';
}

function dd(fixture: ComponentFixture<ParkPanel>, label: string): Element | null {
  const dt = Array.from(el(fixture).querySelectorAll('dt')).find((d) => text(d) === label);
  return dt?.nextElementSibling ?? null;
}

function h2(fixture: ComponentFixture<ParkPanel>): HTMLElement | null {
  return el(fixture).querySelector('h2');
}

function img(fixture: ComponentFixture<ParkPanel>): HTMLImageElement {
  const image = el(fixture).querySelector('img');
  if (!image) {
    throw new Error('No img rendered');
  }
  return image;
}

describe('ParkPanel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  describe('list mode', () => {
    it('links every park by name, in file order', async () => {
      const fixture = await render();
      const links = Array.from(el(fixture).querySelectorAll('nav ul a'));
      expect(links.length).toBe(12);
      expect(links[0].getAttribute('href')).toBe('/parks/prospect-park');
      expect(links[11].getAttribute('href')).toBe('/parks/hillcrest-skate-park');
      expect(links.map((a) => text(a))).toEqual(PARKS.map((p) => p.name));
      expect(links.map((a) => a.getAttribute('href'))).toEqual(PARKS.map((p) => `/parks/${p.id}`));
    });

    it('gives each link one pin colored by its position in the list', async () => {
      const fixture = await render();
      const links = Array.from(el(fixture).querySelectorAll<HTMLElement>('nav ul a'));
      links.forEach((link, i) => {
        const pins = link.querySelectorAll<SVGElement>('svg.pin');
        expect(pins.length).toBe(1);
        const probe = document.createElement('span');
        probe.style.color = pinColor(i);
        expect(pins[0].style.color).toBe(probe.style.color);
      });
    });

    it('shows a loading status and no list while loading', async () => {
      const fixture = await render({ parks: [], loading: true });
      expect(text(el(fixture).querySelector('[role="status"]'))).toBe('Loading parks…');
      expect(el(fixture).querySelector('ul')).toBeNull();
    });

    it('shows the error as an alert and no list', async () => {
      const fixture = await render({ parks: [], error: 'Could not load parks.' });
      expect(text(el(fixture).querySelector('[role="alert"]'))).toBe('Could not load parks.');
      expect(el(fixture).querySelector('ul')).toBeNull();
    });

    it('says there are no parks when the list is empty', async () => {
      const fixture = await render({ parks: [] });
      expect(el(fixture).textContent).toContain('No parks to show.');
      expect(el(fixture).querySelector('ul')).toBeNull();
    });
  });

  describe('details mode', () => {
    it('shows coordinates for Highland Dog Park, which has no address', async () => {
      const fixture = await render({ selectedId: 'highland-dog-park' });
      expect(text(h2(fixture))).toBe('Highland Dog Park');
      expect(text(dd(fixture, 'Location'))).toBe('40.6789, -73.9442');
    });

    it('shows the address verbatim when present', async () => {
      const fixture = await render({ selectedId: 'prospect-park' });
      expect(text(dd(fixture, 'Location'))).toBe('Brooklyn, NY 11225');
    });

    it('says the location is not available when address and coordinates are both missing', async () => {
      const fixture = await render({ parks: [NOWHERE], selectedId: 'nowhere-park' });
      expect(text(dd(fixture, 'Location'))).toBe('Location not available');
    });

    it('shows the description fallback for Old Mill', async () => {
      const fixture = await render({ selectedId: 'old-mill-botanical-garden' });
      const heading = Array.from(el(fixture).querySelectorAll('h3')).find(
        (h) => text(h) === 'Description',
      );
      expect(text(heading?.nextElementSibling)).toBe('No description available.');
    });

    it('hides the rating row and shows one placeholder for Cedar Hill', async () => {
      const fixture = await render({ selectedId: 'cedar-hill-nature-preserve' });
      const labels = Array.from(el(fixture).querySelectorAll('dt')).map((d) => text(d));
      expect(labels).not.toContain('Rating');
      const placeholders = el(fixture).querySelectorAll('.placeholder');
      expect(placeholders.length).toBe(1);
      expect(text(placeholders[0])).toBe('No image available');
      expect(el(fixture).querySelector('.skeleton')).toBeNull();
      expect(el(fixture).querySelector('.caption')).toBeNull();
    });

    it('shows size in acres for Cedar Hill', async () => {
      const fixture = await render({ selectedId: 'cedar-hill-nature-preserve' });
      expect(text(dd(fixture, 'Size'))).toBe('212 acres');
    });

    it('shows hours and a bare rating for Prospect Park', async () => {
      const fixture = await render({ selectedId: 'prospect-park' });
      expect(text(dd(fixture, 'Rating'))).toBe('4.7');
      expect(text(dd(fixture, 'Hours'))).toBe('6:00 AM - 1:00 AM');
    });

    it('hides hours, size, and rating rows when they are null', async () => {
      const fixture = await render({ parks: [NOWHERE], selectedId: 'nowhere-park' });
      const labels = Array.from(el(fixture).querySelectorAll('dt')).map((d) => text(d));
      expect(labels).toEqual(['Location']);
      expect(el(fixture).querySelector('article ul')).toBeNull();
    });

    it('lists Highland amenities as readable labels', async () => {
      const fixture = await render({ selectedId: 'highland-dog-park' });
      const items = Array.from(el(fixture).querySelectorAll('article ul li')).map((li) => text(li));
      expect(items).toEqual(['Dog run', 'Restrooms', 'Parking', 'Water fountain']);
    });

    it('shows Prospect Park photo loading with a one-more caption, then the placeholder on error', async () => {
      const fixture = await render({ selectedId: 'prospect-park' });
      expect(el(fixture).querySelectorAll('.skeleton').length).toBe(1);
      expect(text(el(fixture).querySelector('.caption'))).toBe('and 1 more photo');
      img(fixture).dispatchEvent(new Event('error'));
      await fixture.whenStable();
      expect(text(el(fixture).querySelector('.placeholder'))).toBe('No image available');
      expect(el(fixture).querySelector('.skeleton')).toBeNull();
    });

    it('shows the Prospect Park photo once it loads', async () => {
      const fixture = await render({ selectedId: 'prospect-park' });
      img(fixture).dispatchEvent(new Event('load'));
      await fixture.whenStable();
      expect(img(fixture).classList.contains('hidden')).toBe(false);
      expect(img(fixture).alt).toBe('Prospect Park photo');
      expect(el(fixture).querySelector('.skeleton')).toBeNull();
      expect(el(fixture).querySelector('.placeholder')).toBeNull();
    });

    it('pluralizes the caption for two or more extra photos', async () => {
      const park: Park = { ...NOWHERE, images: ['a.jpg', 'b.jpg', 'c.jpg'] };
      const fixture = await render({ parks: [park], selectedId: 'nowhere-park' });
      expect(text(el(fixture).querySelector('.caption'))).toBe('and 2 more photos');
    });

    it('has no caption for Riverside Commons, which has one image', async () => {
      const fixture = await render({ selectedId: 'riverside-commons' });
      expect(el(fixture).querySelector('.caption')).toBeNull();
    });

    it('says park not found for an unknown id and focuses the heading', async () => {
      const fixture = await render({ selectedId: 'nope' });
      expect(text(h2(fixture))).toBe('Park not found');
      expect(document.activeElement).toBe(h2(fixture));
    });

    it('shows loading, not park not found, while loading with an id', async () => {
      const fixture = await render({ parks: [], loading: true, selectedId: 'prospect-park' });
      expect(text(el(fixture).querySelector('[role="status"]'))).toBe('Loading parks…');
      expect(el(fixture).textContent).not.toContain('Park not found');
    });

    it('shows the error, not park not found, when loading failed with an id', async () => {
      const fixture = await render({
        parks: [],
        error: 'Could not load parks.',
        selectedId: 'prospect-park',
      });
      expect(text(el(fixture).querySelector('[role="alert"]'))).toBe('Could not load parks.');
      expect(el(fixture).textContent).not.toContain('Park not found');
    });
  });

  describe('focus', () => {
    it('moves focus to the details heading on open', async () => {
      const fixture = await render();
      fixture.componentRef.setInput('selectedId', 'highland-dog-park');
      await fixture.whenStable();
      expect(document.activeElement).toBe(h2(fixture));
      expect(text(document.activeElement)).toBe('Highland Dog Park');
    });

    it('returns focus to the park link on close', async () => {
      const fixture = await render();
      fixture.componentRef.setInput('selectedId', 'highland-dog-park');
      await fixture.whenStable();
      fixture.componentRef.setInput('selectedId', undefined);
      await fixture.whenStable();
      expect(document.activeElement?.tagName).toBe('A');
      expect(document.activeElement?.getAttribute('href')).toBe('/parks/highland-dog-park');
    });

    it('moves focus to the new heading when switching parks', async () => {
      const fixture = await render();
      fixture.componentRef.setInput('selectedId', 'prospect-park');
      await fixture.whenStable();
      fixture.componentRef.setInput('selectedId', 'riverside-commons');
      await fixture.whenStable();
      expect(document.activeElement).toBe(h2(fixture));
      expect(text(document.activeElement)).toBe('Riverside Commons');
    });

    it('does not steal focus back on image load or new parks data', async () => {
      const fixture = await render();
      fixture.componentRef.setInput('selectedId', 'prospect-park');
      await fixture.whenStable();
      expect(document.activeElement).toBe(h2(fixture));
      // h3 is not focusable by default; tabindex lets the test park focus inside the article.
      const other = el(fixture).querySelector('article h3') as HTMLHeadingElement;
      other.tabIndex = -1;
      other.focus();
      expect(document.activeElement).toBe(other);
      img(fixture).dispatchEvent(new Event('load'));
      await fixture.whenStable();
      fixture.componentRef.setInput('parks', normalizeParks(sample));
      await fixture.whenStable();
      expect(document.activeElement).toBe(other);
    });

    it('focuses the heading on a deep link', async () => {
      const fixture = await render({ selectedId: 'highland-dog-park' });
      expect(document.activeElement).toBe(h2(fixture));
      expect(text(document.activeElement)).toBe('Highland Dog Park');
    });

    it('focuses the heading once a deep link finishes loading', async () => {
      const fixture = await render({ parks: [], loading: true, selectedId: 'highland-dog-park' });
      fixture.componentRef.setInput('parks', PARKS);
      fixture.componentRef.setInput('loading', false);
      await fixture.whenStable();
      expect(document.activeElement).toBe(h2(fixture));
      expect(text(document.activeElement)).toBe('Highland Dog Park');
    });

    it('does not move focus on the first list render', async () => {
      const before = document.activeElement;
      await render();
      expect(document.activeElement).toBe(before);
    });
  });
});
