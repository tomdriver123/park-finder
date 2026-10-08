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

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    harness = await RouterTestingHarness.create();
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
});
