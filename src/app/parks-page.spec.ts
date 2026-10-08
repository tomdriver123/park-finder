import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import sample from '../../public/assets/parks.sample.json';
import { routes } from './app.routes';

const URL = '/assets/parks.sample.json';

describe('ParksPage (integration)', () => {
  let harness: RouterTestingHarness;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    harness = undefined as unknown as RouterTestingHarness;
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  function root(): HTMLElement {
    return harness.fixture.nativeElement as HTMLElement;
  }

  function heading(): string {
    return root().querySelector('h2')?.textContent?.trim() ?? '';
  }

  async function go(url: string): Promise<void> {
    // Created lazily so a describe block can stub matchMedia before the page exists.
    harness ??= await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    await harness.fixture.whenStable();
  }

  async function flushSample(): Promise<void> {
    httpTesting.expectOne(URL).flush(sample);
    await harness.fixture.whenStable();
  }

  it('redirects / to /parks and lists 12 parks', async () => {
    await go('/');
    await flushSample();
    expect(TestBed.inject(Router).url).toBe('/parks');
    expect(root().querySelectorAll('main nav ul a').length).toBe(12);
  });

  it('opens the details for a deep link once loaded', async () => {
    await go('/parks/highland-dog-park');
    await flushSample();
    expect(heading()).toBe('Highland Dog Park');
    const dt = Array.from(root().querySelectorAll('dt')).find(
      (d) => d.textContent?.trim() === 'Location',
    );
    expect(dt?.nextElementSibling?.textContent?.trim()).toBe('40.6789, -73.9442');
  });

  it('walks list, park A, park B, list, and returns focus to park B', async () => {
    await go('/parks');
    await flushSample();
    expect(heading()).toBe('Parks');

    await go('/parks/prospect-park');
    expect(heading()).toBe('Prospect Park');

    await go('/parks/riverside-commons');
    expect(heading()).toBe('Riverside Commons');

    await go('/parks');
    expect(heading()).toBe('Parks');
    expect(document.activeElement?.getAttribute('href')).toBe('/parks/riverside-commons');
  });

  it('shows the load error on a details URL, never park not found', async () => {
    await go('/parks/highland-dog-park');
    httpTesting.expectOne(URL).flush('boom', { status: 500, statusText: 'Server Error' });
    await harness.fixture.whenStable();
    expect(root().querySelector('[role="alert"]')?.textContent?.trim()).toBe(
      'Could not load parks.',
    );
    expect(root().textContent).not.toContain('Park not found');
  });

  it('says park not found for an unknown id after loading', async () => {
    await go('/parks/nope');
    await flushSample();
    expect(heading()).toBe('Park not found');
  });

  it('renders a pin for each park in the map aside', async () => {
    await go('/parks');
    await flushSample();
    expect(root().querySelectorAll('aside .park-pin').length).toBe(12);
    expect(root().querySelector('aside')?.getAttribute('aria-label')).toBe('Map');
    expect(root().querySelector('main')?.nextElementSibling?.tagName).toBe('ASIDE');
  });

  it('opens the details when a map pin is selected', async () => {
    await go('/parks');
    await flushSample();
    const pin = Array.from(root().querySelectorAll<HTMLElement>('aside .park-pin')).find(
      (el) => el.getAttribute('title') === 'Highland Dog Park',
    );
    pin?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/parks/highland-dog-park');
    expect(heading()).toBe('Highland Dog Park');
    expect(pin?.classList.contains('is-selected')).toBe(true);
  });

  it('renders no sheet toggle on desktop', async () => {
    await go('/parks');
    await flushSample();
    expect(root().querySelector('button[aria-controls="sheet"]')).toBeNull();
  });

  describe('mobile sheet', () => {
    const MOBILE_QUERY = '(max-width: 767.98px)';

    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        writable: true,
        value: (query: string) => ({
          matches: query === MOBILE_QUERY,
          media: query,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
        }),
      });
    });

    afterEach(() => {
      delete (window as unknown as { matchMedia?: unknown }).matchMedia;
    });

    function toggle(): HTMLButtonElement {
      return root().querySelector<HTMLButtonElement>('main button[aria-controls="sheet"]')!;
    }

    it('toggle button starts collapsed and expands on click', async () => {
      await go('/parks');
      await flushSample();
      expect(toggle().textContent?.trim()).toBe('Show more');
      expect(toggle().getAttribute('aria-expanded')).toBe('false');

      toggle().click();
      await harness.fixture.whenStable();
      expect(toggle().getAttribute('aria-expanded')).toBe('true');
      expect(toggle().textContent?.trim()).toBe('Show less');
      expect(root().querySelector('main')?.classList.contains('is-expanded')).toBe(true);
    });

    it('navigating to a park expands the sheet, back collapses it', async () => {
      await go('/parks');
      await flushSample();
      expect(toggle().getAttribute('aria-expanded')).toBe('false');

      await go('/parks/prospect-park');
      expect(toggle().getAttribute('aria-expanded')).toBe('true');

      await go('/parks');
      expect(toggle().getAttribute('aria-expanded')).toBe('false');
    });

    it('focus moving into the map collapses the expanded sheet', async () => {
      await go('/parks/prospect-park');
      await flushSample();
      expect(toggle().getAttribute('aria-expanded')).toBe('true');

      root()
        .querySelector('aside .leaflet-container')
        ?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      await harness.fixture.whenStable();
      expect(toggle().getAttribute('aria-expanded')).toBe('false');
    });

    it('main precedes aside in the DOM', async () => {
      await go('/parks');
      await flushSample();
      expect(root().querySelector('main')?.nextElementSibling?.tagName).toBe('ASIDE');
    });
  });
});
