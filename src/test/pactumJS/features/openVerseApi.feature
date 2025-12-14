@f4 @apiSmoke
Feature: Practice API
Testing openVerse api

    @SkipOnFailure @api
    Scenario: Setting baseurl, timeout and generating tokens
        Given user sets the base url to "https://api.openverse.org/v1"
            And user sets the request timeout to 30000 milliseconds
            And user generates OAuth Token
            And user generates access token

    @a1 @api @SkipOnFailure
    Scenario: Audio url testing
        When user makes a get request to "audio" endpoint with "9da64ef3-0449-4935-a79f-97b7008d1cff"
        Then user should see the response with status code 200
            And user assert that response body contains "title" as "To The Moon"
            And user assert that response body contains "creator" as "Ton in Ton"
            And user assert that response body contains "genres" as "chillout,downtempo,electronic"
            And user assert that response body contains "tags[0].name" as "dreamy"
            And user assert that response body contains "tags[1].name" as "drums"
            And user assert that response body contains "tags[2].name" as "instrumental"
            And user assert that response body contains "tags[3].name" as "peaceful"
            And user assert that response body contains "tags[4].name" as "speed_medium"
            And user assert that response body contains "tags[5].name" as "synthi"
            And user assert that response body contains "audio_set.title" as "Al Cante"

    @i1 @api @SkipOnFailure
    Scenario: Images url testing
        When user makes a get request to "images" endpoint with "8c9ae3ff-a714-485a-97b5-e44a10d16bfb"
        Then user should see the response with status code 200
            And user assert that response body contains "title" as "Crux IAU"
            And user assert that response body contains "creator" as "IAU and Sky & Telescope magazine (Roger Sinnott & Rick Fienberg)"
            And user assert that response body contains "filesize" as "392217"
            And user assert that response body contains "height" as "577"
            And user assert that response body contains "width" as "609"
