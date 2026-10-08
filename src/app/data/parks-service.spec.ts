import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import sample from '../../../public/assets/parks.sample.json';
import { ParksService } from './parks-service';

const URL = '/assets/parks.sample.json';

describe('ParksService', () => {
  let service: ParksService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ParksService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('is loading, with no parks and no error, before the response arrives', () => {
    httpTesting.expectOne(URL);
    expect(service.loading()).toBe(true);
    expect(service.parks()).toEqual([]);
    expect(service.error()).toBeNull();
  });

  it('exposes the 12 sample parks once loaded', () => {
    httpTesting.expectOne(URL).flush(sample);
    expect(service.parks().length).toBe(12);
    expect(service.loading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  it('reports an error on HTTP 500', () => {
    httpTesting.expectOne(URL).flush('boom', { status: 500, statusText: 'Server Error' });
    expect(service.parks()).toEqual([]);
    expect(service.loading()).toBe(false);
    expect(service.error()).toBe('Could not load parks.');
  });

  it('reports an error when the body is not an array', () => {
    httpTesting.expectOne(URL).flush({});
    expect(service.parks()).toEqual([]);
    expect(service.loading()).toBe(false);
    expect(service.error()).toBe('Could not load parks.');
  });
});
