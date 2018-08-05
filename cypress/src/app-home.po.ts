import { AbstractPage, URLs } from './abstract.po';

export class AppHomePage extends AbstractPage {
  static URL = URLs.Home;

  public static visitAnEvent(eventName: string): void {
    cy.get('.mat-row a')
      .contains(eventName)
      .eq(0)
      .click();
    this.expectToBeOnEventPage(eventName);
  }
}
