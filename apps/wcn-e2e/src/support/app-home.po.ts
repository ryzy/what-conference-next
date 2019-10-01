import { AbstractPage, URLs } from './abstract.po';

export class AppHomePage extends AbstractPage {
  static URL = URLs.Home;

  public static getEventsList() {
    return cy.get('.mat-row .mat-column-name a');
  }

  public static visitAnEvent(eventName?: string): void {
    const eventLinks = this.getEventsList();
    const eventLink = eventName ? eventLinks.contains(eventName).eq(0) : eventLinks.eq(0);

    eventLink.click();

    this.expectToBeOnEventPage(eventName);
  }

  public static expectToHaveEventsList(atLeastNumOfEvents: number = 1): void {
    this.getEventsList()
      .its('length')
      .should('be.gt', atLeastNumOfEvents);
  }
}
