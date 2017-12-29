import { CoreModule } from './core.module';
import { throwIfAlreadyLoaded } from './core-utils';

describe('core-utils', () => {
  it('#throwIfAlreadyLoaded', () => {
    expect(throwIfAlreadyLoaded(undefined, 'CoreModule')).toBeFalsy();
    expect(() => throwIfAlreadyLoaded(new CoreModule(), 'CoreModule'))
      .toThrowError(/has already been loaded/);
  });
});
