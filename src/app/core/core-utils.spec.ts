import { CoreModule } from './core.module';
import { throwIfAlreadyLoaded, uuid } from './core-utils';

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
});
