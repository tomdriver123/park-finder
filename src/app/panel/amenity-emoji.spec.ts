import sample from '../../../public/assets/parks.sample.json';
import { normalizeParks } from '../data/normalize';
import { amenityEmoji } from './amenity-emoji';

describe('amenityEmoji', () => {
  it('maps every amenity in the sample to something other than the fallback', () => {
    const labels = new Set(normalizeParks(sample).flatMap((park) => park.amenities));
    expect(labels.size).toBeGreaterThan(0);
    for (const label of labels) {
      expect(amenityEmoji(label), label).not.toBe('🌳');
    }
  });

  it('ignores case and surrounding whitespace', () => {
    expect(amenityEmoji('Dog run')).toBe('🐕');
    expect(amenityEmoji('dog run')).toBe('🐕');
    expect(amenityEmoji(' DOG RUN ')).toBe('🐕');
  });

  it('falls back to a tree for an unknown label', () => {
    expect(amenityEmoji('Zip line')).toBe('🌳');
  });
});
