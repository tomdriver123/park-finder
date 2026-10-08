import sample from '../../../public/assets/parks.sample.json';
import { normalizePark, normalizeParks } from './normalize';
import { Park } from './park';

function sampleParks(): Park[] {
  return normalizeParks(sample);
}

function byId(id: string): Park {
  const park = sampleParks().find((p) => p.id === id);
  if (!park) {
    throw new Error(`Missing sample park ${id}`);
  }
  return park;
}

describe('normalize with the sample file', () => {
  it('keeps Highland Dog Park without an address and with its coordinates', () => {
    const park = byId('highland-dog-park');
    expect(park.address).toBeNull();
    expect(park.coordinates).toEqual({ lat: 40.6789, lng: -73.9442 });
  });

  it('leaves only the description empty for Old Mill Botanical Garden', () => {
    const park = byId('old-mill-botanical-garden');
    expect(park.description).toBeNull();
    expect(park.name).toBe('Old Mill Botanical Garden');
    expect(park.coordinates).toEqual({ lat: 40.6215, lng: -74.0776 });
    expect(park.address).toBe('12 Old Mill Ln');
    expect(park.amenities.length).toBeGreaterThan(0);
    expect(park.hours).toBe('9:00 AM - 5:00 PM');
    expect(park.images).toEqual([
      'https://images.example.com/oldmill-1.jpg',
      'https://images.example.com/oldmill-2.jpg',
    ]);
    expect(park.acreage).toBe(34);
    expect(park.rating).toBe(4.6);
  });

  it('gives Cedar Hill Nature Preserve a null rating and no images', () => {
    const park = byId('cedar-hill-nature-preserve');
    expect(park.rating).toBeNull();
    expect(park.images).toEqual([]);
  });

  it('returns all 12 parks in file order with coordinates', () => {
    const parks = sampleParks();
    expect(parks.map((p) => p.id)).toEqual([
      'prospect-park',
      'riverside-commons',
      'cedar-hill-nature-preserve',
      'sunset-playground',
      'highland-dog-park',
      'veterans-memorial-field',
      'old-mill-botanical-garden',
      'lakeshore-point',
      'east-ridge-trailhead',
      'central-plaza-green',
      'willow-creek-wetlands',
      'hillcrest-skate-park',
    ]);
    expect(parks.every((p) => p.coordinates !== null)).toBe(true);
  });

  it('turns Prospect Park amenities into readable labels', () => {
    expect(byId('prospect-park').amenities).toEqual([
      'Playground',
      'Dog run',
      'Trails',
      'Restrooms',
      'Parking',
      'Lake',
      'Picnic areas',
    ]);
  });
});

describe('normalize edge rows', () => {
  const base = { id: 'x', name: 'X', location: { lat: 10, lng: 20 } };

  it('drops a row with no id', () => {
    expect(normalizePark({ name: 'No id' })).toBeNull();
  });

  it('uses the id as the name when the name is blank', () => {
    expect(normalizePark({ ...base, name: '   ' })?.name).toBe('x');
  });

  it('keeps a park with no location, with null coordinates', () => {
    const park = normalizePark({ id: 'x', name: 'X' });
    expect(park).not.toBeNull();
    expect(park?.coordinates).toBeNull();
  });

  it('nulls coordinates when latitude is out of range', () => {
    const park = normalizePark({ ...base, location: { lat: 95, lng: 20 } });
    expect(park?.coordinates).toBeNull();
  });

  it('treats a string rating as missing', () => {
    expect(normalizePark({ ...base, rating: '4.7' })?.rating).toBeNull();
  });

  it('keeps a rating of 0', () => {
    expect(normalizePark({ ...base, rating: 0 })?.rating).toBe(0);
  });

  it('keeps only trimmed non-blank image strings', () => {
    expect(normalizePark({ ...base, images: [null, '', ' a.jpg '] })?.images).toEqual(['a.jpg']);
  });

  it('turns null amenities into an empty list', () => {
    expect(normalizePark({ ...base, amenities: null })?.amenities).toEqual([]);
  });

  it('turns a blank description into null', () => {
    expect(normalizePark({ ...base, description: '   ' })?.description).toBeNull();
  });

  it('keeps the first of two rows with the same id', () => {
    const parks = normalizeParks([
      { id: 'x', name: 'First' },
      { id: 'x', name: 'Second' },
    ]);
    expect(parks.map((p) => p.name)).toEqual(['First']);
  });

  it('throws when the input is not an array', () => {
    expect(() => normalizeParks({})).toThrow();
  });
});
