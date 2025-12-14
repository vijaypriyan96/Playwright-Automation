@f2
Feature: Practice and become pro in test automation

    Background:
        Given user navigates to the Let Code - Practice and become pro in test automation

    @l1
    Scenario: Play with Input Elements
        When user clicks on "Edit" link text
        Then assert that "Input" text is visible
        When user enters "Test Automation User" into "Enter your full Name" text box
        When user appends " Tester" into "Append a text and press keyboard tab" text box
        Then user asserts that "What is inside the text box" field is equal to "ortonikc" text
        When user enters "" into "Clear the text" text box
        Then user asserts that "Confirm edit field is disabled" field is disabled
        Then user asserts that "Confirm text is readonly" field is readonly
    
    @l2
    Scenario: Play with File Management
        When user clicks on "File management" link text
        Then assert that "Upload and Download" text is visible
        When user downloads by clicking on "Download Pdf"

    @l3
    Scenario: Play with Buttons
        When user clicks on "Click" link text
        Then assert that "Button" text is visible
        When user clicks on button "Goto Home"
        Given user navigates to the Let Code - Practice and become pro in test automation
        When user clicks on "Click" link text
        Then assert that "Button" text is visible
        When user gets x y coordinates of "Find Location" button
        Then user gets the css properties of button "What is my color?"
        Then user asserts that button "Disabled" is disabled
        When user clicks and hold "Button Hold!" button for 3 seconds
        Then assert that "Button has been long pressed" text is visible

    @l4
    Scenario: Play with DropDowns
        When user clicks on "Drop-Down" link text
        Then assert that "Dropdown" text is visible
        # When user selects "Mango"6 options and prints all of them from the dropdown "Select the last programming language and print all the options"
        When user selects "Venezuela" values from the dropdown "Select India using value & print the selected value"
        When user gets the length of options and prints all of them from the dropdown "Select India using value & print the selected value"
        When user gets the value from the dropdown "Select India using value & print the selected value"

    @l5
    Scenario: Play with Alerts
        When user clicks on "Dialog" link text
        Then assert that "Alert" text is visible
        When user clicks "cancel" for the alert by clicking "Confirm Alert" button
    
    @l6
    Scenario: Play with Prompt Alerts
        When user clicks on "Dialog" link text
        Then assert that "Alert" text is visible
        When user enters "Automation User" into the alert by clicking "Prompt Alert" button
        Then assert that "Your name is: Automation User" text is visible 

    @l7
    Scenario: Play with drag
        When user clicks on "AUI - 1" link text
        Then assert that "Drag" text is visible
        When user drags the element to new position
    
    @l8
    Scenario: Play with drop
        When user clicks on "AUI - 2" link text
        Then assert that "Drop" text is visible
        When user drags and drops the element 

    @l9
    Scenario: Play with Sort
        When user clicks on "AUI - 3" link text
        Then assert that "Sort" text is visible
        When user drags the "Get up" work item to "To do" section
        When user drags the "Go home" work item to "Done" section
        When user drags the "Walk dog" work item to "To do" section
        When user drags the "Get to work" work item to "Done" section

    @l10
    Scenario: Play with Alerts
        When user clicks on "DOM" link text
        Then assert that "Shadow DOM" text is visible
        Then user asserts that shadow dom is accessible
