import { CoreModule } from './core.module';
import { randomRange, throwIfAlreadyLoaded, uuid } from './core-utils';

describe('core-utils', () => {
  it('#throwIfAlreadyLoaded', () => {
    expect(throwIfAlreadyLoaded(undefined, 'CoreModule')).toBeFalsy();
    expect(() => throwIfAlreadyLoaded(true, 'CoreModule')).toThrowError(/has already been loaded/);
  });

  it('#uuid', () => {
    expect(uuid()).toBeTruthy();

    expect(uuid(3)).toBeTruthy();
    expect(uuid(3).length).toBe(3);
  });

  it('#randomRange', () => {
    const range = randomRange(3, 7);
    expect(range).toBeGreaterThanOrEqual(3);
    expect(range).toBeLessThanOrEqual(7);
  });
});
