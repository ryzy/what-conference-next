Feature: Event Form

  Scenario: User should be able to visit [New Event] page from the main menu
            and the form should be correctly rendered
            (i.e. the 1st field focused etc)

      Given I visit "Home" page
       When I click on a "New Event" link
       Then I should see "Submit Event" button "disabled"


  Scenario: Form should work with sample data
      Given I visit "NewEventForm" page
       When I enter "Event" in the field "name"
        And I tick checkbox no "1" in the field "topicTags"
        And I select "some date" in the calendar field "date"
        And I select option no "1" in the dropdown "sizeBand"
        And I enter "666" in the field "price"
        And I enter "Fr" in the field "country"
        And I select option no "2" from the autocomplete field "country"
        And I enter "Paris" in the field "city"
        And I enter "Museum Louvre" in the field "address"
        And I enter "https://www.louvre.fr/en/evenements" in the field "website"
        And I enter "SuperConf" in the field "twitterHandle"
        And I enter "Lorem ipsum dolar sit amet." in the field "description"
       Then I should see "Submit Event" button "enabled"


  Scenario: Calendar field should allow manual input
      Given I visit "NewEventForm" page
       When I enter "12/12/2022" in the field "date"
       Then I should see "Submit Event" button "disabled"
        And I should see "What Conference Next" in the title
