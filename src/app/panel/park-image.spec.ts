import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParkImage } from './park-image';

const ALT = 'Prospect Park photo';

async function render(src: string | null): Promise<ComponentFixture<ParkImage>> {
  const fixture = TestBed.createComponent(ParkImage);
  fixture.componentRef.setInput('src', src);
  fixture.componentRef.setInput('alt', ALT);
  await fixture.whenStable();
  return fixture;
}

function el(fixture: ComponentFixture<ParkImage>): HTMLElement {
  return fixture.nativeElement as HTMLElement;
}

describe('ParkImage', () => {
  it('starts loading, shows the placeholder on error, and resets to loading on a new src', async () => {
    const fixture = await render('https://images.example.com/prospect-1.jpg');
    expect(el(fixture).querySelector('.skeleton')).not.toBeNull();
    expect(el(fixture).querySelector('img')).not.toBeNull();
    expect(el(fixture).querySelector('.placeholder')).toBeNull();

    el(fixture).querySelector('img')?.dispatchEvent(new Event('error'));
    await fixture.whenStable();
    expect(el(fixture).querySelector('.placeholder')?.textContent?.trim()).toBe(
      'No image available',
    );
    expect(el(fixture).querySelector('.skeleton')).toBeNull();

    fixture.componentRef.setInput('src', 'https://images.example.com/other.jpg');
    await fixture.whenStable();
    expect(el(fixture).querySelector('.skeleton')).not.toBeNull();
    expect(el(fixture).querySelector('.placeholder')).toBeNull();
  });

  it('shows the placeholder at once for a null src, then loads a new string src', async () => {
    const fixture = await render(null);
    expect(el(fixture).querySelector('.placeholder')?.textContent?.trim()).toBe(
      'No image available',
    );
    expect(el(fixture).querySelector('.skeleton')).toBeNull();
    expect(el(fixture).querySelector('img')).toBeNull();

    fixture.componentRef.setInput('src', 'https://images.example.com/a.jpg');
    await fixture.whenStable();
    expect(el(fixture).querySelector('.skeleton')).not.toBeNull();
    expect(el(fixture).querySelector('.placeholder')).toBeNull();
  });

  it('shows the image with its alt text once loaded', async () => {
    const fixture = await render('https://images.example.com/prospect-1.jpg');
    el(fixture).querySelector('img')?.dispatchEvent(new Event('load'));
    await fixture.whenStable();
    const image = el(fixture).querySelector('img');
    expect(image).not.toBeNull();
    expect(image?.classList.contains('hidden')).toBe(false);
    expect(image?.alt).toBe(ALT);
    expect(el(fixture).querySelector('.skeleton')).toBeNull();
    expect(el(fixture).querySelector('.placeholder')).toBeNull();
  });
});
