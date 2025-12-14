@f5 @graphqlApi
Feature: graphqlApi 

    Background: Setting graphql url, timeout and generating tokens
        Given user sets the graphql url to "http://www.rahulshettyacademy.com/gq/graphql"
            And user sets the graphql request timeout to 30000 milliseconds

    @g1 @api
    Scenario: Marvel characters query
        When user queries with payload in file "marvelCharacters.json"
        Then user should see the graphql response with status code 200
        Then user verifies if the response matches the snapshot in file "marvelCharacters.json"

    @g2 @api
    Scenario: Europe locations query
        When user queries with payload in file "europeLocations.json"
        Then user should see the graphql response with status code 200
        Then user verifies if the response matches the snapshot in file "europeLocations.json"

    @g3 @api
    Scenario: New location mutation query
        When user queries with payload in file "newLocation.json"
        Then user should see the graphql response with status code 200
        Then user verifies if the response matches the snapshot in file "newLocation.json"
 