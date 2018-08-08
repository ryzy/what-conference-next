/**
 * Prevent re-import of core modules
 *
 * @url https://angular.io/guide/styleguide#style-04-12
 *
 * Usage:
 * ```
 * export class MyModule {
 *   constructor(@Optional() @SkipSelf() parentModule: MyModule) {
 *     throwIfAlreadyLoaded(parentModule, 'MyModule');
 *   }
 * }
 * ```
 */
export function throwIfAlreadyLoaded(parentModule: any, moduleName: string): void {
  if (parentModule) {
    throw new Error(`${moduleName} has already been loaded. Import Core modules in the AppModule only.`);
  }
}

/**
 * Returns true if code is executed in test (i.e. Karma) context.
 */
export function isUnitTestContext(): boolean {
  return !!(window as any).__karma__;
}

// tslint:disable:no-bitwise
/**
 * Generate UUID string
 */
export function uuid(length?: number): string {
  const str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
    const r: number = (Math.random() * 16) | 0;
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

  return length ? str.substr(0, length) : str;
}
// tslint:enable:no-bitwise

/**
 * Get random number from given range
 */
export function randomRange(min: number = 0, max: number = 999): number {
  return Math.floor(Math.random() * (max - min)) + min;
}
