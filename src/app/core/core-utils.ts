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
