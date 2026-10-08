import { Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { ParksPage } from './parks-page';

/**
 * Matches both `parks` and `parks/:id` with one route config, so the router reuses ParksPage
 * across open and close instead of recreating it (which would lose the panel's focus memory).
 */
export function parksMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length === 0 || segments[0].path !== 'parks' || segments.length > 2) {
    return null;
  }
  const [, id] = segments;
  return id ? { consumed: segments, posParams: { id } } : { consumed: segments };
}

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/parks' },
  { matcher: parksMatcher, component: ParksPage },
  { path: '**', redirectTo: '/parks' },
];
