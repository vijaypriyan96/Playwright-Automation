@f1
Feature: User Login

    Background:
        Given user navigates to the Orange Hrm application login page
        Then assert that "Login" text is displayed
        When user enters "Admin" into "Username" field
            And user enters "admin123" into "Password" field
        When user clicks on "Login" button
        Then assert that "Login" text is not displayed

    @Smoke
    Scenario: Delete the employee if it exists
        When user "expands" the side menu
            And user clicks on "PIM" text
            And user "collapses" the side menu
        Then assert that "Employee Information" text is displayed
        When user enters "Test Automation User" into "Employee Name" field
            And user clicks on "Search" button
        Then assert that "(1) Record Found" text is displayed
            And assert that below table is displayed
                | CheckBox   | Id        | First Name      | Last Name | Job Title | Employment Status | Sub Unit | Supervisor | Actions    |
                | <<ignore>> | 123456789 | Test Automation | User      |           |                   |          | <<ignore>> | <<ignore>> |
        When user clicks on "delete" in the table for row 1
        Then assert that "Are you Sure?" text is displayed
            And assert that "The selected record will be permanently deleted. Are you sure you want to continue?" text is displayed
        When user clicks on "Yes, Delete" button
        Then assert that "Success" status banner with "Successfully Deleted" message is displayed
        When user closes the notification banner
            And user clicks on "Search" button
        Then assert that "Info" status banner with "No Records Found" message is displayed

    @a
    Scenario: Create and search new Employee in PIM module
        When user "expands" the side menu
            And user clicks on "PIM" text
            And user "collapses" the side menu
        Then assert that "Employee Information" text is displayed
        When user clicks on "Add" button
        Then assert that "Add Employee" text is displayed
        When user uploads "image1.jpg" file
            And user enters "Test" into "First Name" placeholder
            And user enters "Automation" into "Middle Name" placeholder
            And user enters "User" into "Last Name" placeholder
            And user enters "123456789" into "Employee Id" field
            And user clicks on the "Create Login Details" toggle
        Then assert that "For a strong password, please use a hard to guess combination of text with upper and lower case characters, symbols and numbers" text is displayed
        When user enters "TestAutomation" into "Username" field
        When user clicks on "Enabled" for "Status" radio button
            And user enters "AMCtest12#$" into "Password" field
            And user enters "AMCtest12#$" into "Confirm Password" field
        Then assert that "Strong " text is displayed
        When user clicks on "Save" button
        Then assert that "Success" status banner with "Successfully Saved" message is displayed
        When user closes the notification banner
        Then assert that "Personal Details" text is displayed
        When user enters "DL123456" into "Driver's License Number" field
            And user selects "2010-10-11" date from "License Expiry Date" field
            And user selects "Indian" from "Nationality" dropdown
            And user selects "Single" from "Marital Status" dropdown
            And user selects "1995-28-03" date from "Date of Birth" field
            And user clicks on "Male" for "Gender" radio button
            And user clicks on "Save" button's 1 occurrence
        Then assert that "Success" status banner with "Successfully Updated" message is displayed
        When user closes the notification banner
            And user selects "A+" from "Blood Type" dropdown
            And user enters "Blood Test" into "Test_Field" field
            And user clicks on "Save" button's 2 occurrence
        Then assert that "Success" status banner with "Successfully Saved" message is displayed
        When user closes the notification banner
            And user clicks on "Add" button
            And user uploads "AddressProof.docx" file through file explorer
            And user enters "Address proof uploaded" into "Type comment here" textarea
            And user clicks on "Save" button's 3 occurrence
        Then assert that "Success" status banner with "Successfully Saved" message is displayed
        When user closes the notification banner
        Then wait for the spinner to close
            And assert that below table is displayed
                | CheckBox   | File Name         | Description            | Size          | Type          | Date Added     | Added By | Actions |
                | <<ignore>> | AddressProof.docx | Address proof uploaded | <<not-empty>> | <<not-empty>> | <<today-date>> | Admin    |         |
        When user "expands" the side menu
            And user clicks on "PIM" text
            And user "collapses" the side menu
        Then assert that "Employee Information" text is displayed
        When user enters "Test Automation User" into "Employee Name" field
            And user clicks on "Search" button
        Then assert that "(1) Record Found" text is displayed
            And assert that below table is displayed
                | CheckBox   | Id        | First Name      | Last Name | Job Title | Employment Status | Sub Unit | Supervisor | Actions    |
                | <<ignore>> | 123456789 | Test Automation | User      |           |                   |          | <<ignore>> | <<ignore>> |
        When user clicks on "edit" in the table for row 1
        Then assert that "Personal Details" text is displayed
        When user clicks on download on row 1

    @c
    Scenario: Edit the employee details
        When user "expands" the side menu
            And user clicks on "PIM" text
            And user "collapses" the side menu
        Then assert that "Employee Information" text is displayed
        When user enters "Test Automation User" into "Employee Name" field
            And user clicks on "Search" button
        Then assert that "(1) Record Found" text is displayed
            And assert that below table is displayed
                | CheckBox   | Id        | First Name      | Last Name | Job Title | Employment Status | Sub Unit | Supervisor | Actions    |
                | <<ignore>> | 123456789 | Test Automation | User      |           |                   |          | <<ignore>> | <<ignore>> |
        When user clicks on "edit" in the table for row 1
        Then assert that "Personal Details" text is displayed
           
    @d
    Scenario: Switching between Tabs
        When user "expands" the side menu
            And user clicks on "PIM" text
            And user "collapses" the side menu
        Then assert that "Employee Information" text is displayed
        When user clicks on "Help" button title
        Given user switches to browser tab 2
        Then assert that "Admin User Guide" text is displayed
        Given user switches to browser tab 1
        Then assert that "Employee Information" text is displayed
        When user enters "Test Automation User" into "Employee Name" field
            And user clicks on "Search" button
        Then assert that "(1) Record Found" text is displayed
            And assert that below table is displayed
                | CheckBox   | Id        | First Name      | Last Name | Job Title | Employment Status | Sub Unit | Supervisor | Actions    |
                | <<ignore>> | 123456789 | Test Automation | User      |           |                   |          | <<ignore>> | <<ignore>> |