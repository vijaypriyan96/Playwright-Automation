@f3
Feature: Practice Test Automation Website for Web UI & API

    Background:
        Given user navigates to the Practice texting website
        Then assert that the "Sample applications for practice test automation" text is visible

    @p1
    Scenario: Basic Authentication   
        When user clicks on the "Basic Authentication (user and pass: admin)" link text
        Then assert that the "Congratulations! You must have the proper credentials." text is visible
    
    @p2
    Scenario: Shadow Dom 
        When user clicks on the "Shadow DOM" link text
        Then assert that the "Shadow DOM page for Automation Testing Practice" text is visible
        When user clicks on shadow button

