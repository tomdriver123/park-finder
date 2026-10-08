import { PIN_COLORS, PIN_PATH, pinColor } from './pin-colors';

describe('pinColor', () => {
  it('has 12 distinct colors', () => {
    expect(PIN_COLORS.length).toBe(12);
    expect(new Set(PIN_COLORS).size).toBe(12);
  });

  it('starts with the first color', () => {
    expect(pinColor(0)).toBe('#c1121f');
    expect(pinColor(11)).toBe('#6b8e23');
  });

  it('wraps to the first color after the twelfth', () => {
    expect(pinColor(12)).toBe('#c1121f');
    expect(pinColor(13)).toBe('#e36414');
  });

  it('exports a non-empty pin path', () => {
    expect(PIN_PATH.startsWith('M14 0')).toBe(true);
  });
});
