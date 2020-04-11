// GLOBAL VARIABLES FOR USE
// Array where 8 matching names will be stored
var namefaceMatches = [];
// Single name called for specific use
// var namefaceMatch = "";
// boolean value to test match validity
var celebrityFound = false;
// IMDb API Key
var imdbApiKey = "k_Yj7L9aPc";
// Three items we want to grab from the IMDb search and post to site
var matchName = "";
var matchImgURL = "";
var matchDescription = "";
// Used to keep functions waiting until one is completed
//var wait = true;
// If good match is found
// var matchFound = false;
// SECONDARY API KEY FOR NAMEFACE API
var namefaceSecondaryAPIKey = "efc5acba70mshee51db23cc82531p1bffd9jsn8e339ffa933d";


// FOR THE TIME BEING
localStorage.clear();


// FUNCTIONS

// Settings and API call to namefaceapi

    // IN SETTINGS FIND WAY TO USE displayModal FUNCTION WHEN ERROR OCCURS

var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://nameface.p.rapidapi.com/recognize",
    "method": "POST",
    "headers": {
        "x-rapidapi-host": "nameface.p.rapidapi.com",
        "x-rapidapi-key": namefaceSecondaryAPIKey,
        "content-type": "application/json",
        "accept": "application/json"
    },
    "processData": false,
    "data": "{  \"images\": [\"https://i.ibb.co/2j8cKjV/headshot-alex1.jpg\"]}"
}


var faceNameAPICall = function(imgURL) {

    if(imgURL === ""){
        console.log("Search was empty!");
        //return;
    }

    $.ajax(settings).done(function (response) {

        console.log(response);
        // Matching names of Alex's photo
        namefaceMatches = [response.images[0].results[0].matches[0].name,
        response.images[0].results[0].matches[1].name,
        response.images[0].results[0].matches[2].name,
        response.images[0].results[0].matches[3].name,
        response.images[0].results[0].matches[4].name,
        response.images[0].results[0].matches[5].name,
        response.images[0].results[0].matches[6].name,
        response.images[0].results[0].matches[7].name];


        checkMatches(namefaceMatches);
    });


}


// Checking the facename matches in the imdb API

var checkMatches = function(namefaceMatches) {
    
    // LOOPING THROUGH ALL CELEBS ON LIST
    for(var i = (namefaceMatches.length - 1); i >= 0; i--) {
        
        // if(matchFound === true) {
        //     return;
        // }


        const namefaceMatch = namefaceMatches[i];

        // Name is swapped to replace spaces with "%20" in order to pass the whole name through the api search
        var fixName = namefaceMatches[i];
        var space = " ";
        var spaceFill = "%20";

        while (fixName.indexOf(space) > -1) {
            fixName = fixName.replace(space, spaceFill);
        }
      
        var searchCeleb = fixName;
    
        var queryURL = "https://imdb-api.com/en/API/SearchName/" + imdbApiKey + "/" + searchCeleb;

        imdbAPIcall(queryURL, namefaceMatch).then(postMatch);
        
    }

};


var imdbAPIcall = function (queryURL, namefaceMatch) {

    return new Promise((resolve, reject) => {

        $.ajax({
            url: queryURL,
            method: "GET",
            crossDomain: true,
            error: function (err) {
                celebrityFound = false;
                console.log(err.status);
                //postMatch();
            }
        }).then(function (response) {
            celebrityFound = true;
            console.log(response);

            // Setting up conditionals so that we only select a match with favorable characteristics
            // If the name doesn't contain IMDb Data
            if (response.results.length < 1) {
                console.log("No found results for " + namefaceMatch);
                return;
            }
            // If the IMDb name doesn't actually match the nameface name
            else if (namefaceMatch != response.results[0].title) {
                console.log(namefaceMatch + " != " + response.results[0].title);
                return;
            }
            // If the person on IMDb has a "nopicture" placeholder
            else if (response.results[0].image === "https://imdb-api.com/images/original/nopicture.jpg") {
                console.log(namefaceMatch + " has no image available.");
            }
            else {
                //console.log(namefaceMatch + " = " + response.results[0].title);
                matchName = response.results[0].title;
                //console.log("matchName = " + matchName);
                matchImgURL = response.results[0].image;
                //console.log("matchImgURL = " + matchImgURL);
                matchDescription = response.results[0].description;
                //console.log("matchDescription" + matchDescription);
                matchFound = true;
            }

            resolve({ matchName, matchImgURL, matchDescription });

        })
    });
};


// Posting the matched celebrity information to the webpage
var postMatch = function ({ matchName, matchImgURL, matchDescription }) {
    // wikiResult(matchName);
    // Checking what match results were stored for this search
    console.log("Mark!");
    console.log("Posting the true match information!");
    console.log("matchName = " + matchName);
    console.log("matchImgURL = " + matchImgURL);
    console.log("matchDescription = " + matchDescription);

    // Appending the data to the html card
    $("#celebResult").html(matchName);
    $("#celebImage").attr("src", matchImgURL);
    $("#celebDOB").html(matchDescription);
    saveMatchHistory(matchName);
    // ADD IN WIKIPEDIA RESULT!
    wikiResult(matchName);
};



//this is just a test, remove later
var test = "Scarlett O'Hara";
wikiResult(test);


//to find results from wikipedia api
function wikiResult(matchName) {
    var endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${matchName}`;
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            const results = data.query.search;
            displayResults(results);
        });
}

//display wikipedia results
function displayResults(results) {

    console.log(results);

    var url = encodeURI(`https://en.wikipedia.org/wiki/${results[0].title}`);
    $("#celebWikiResult").html('<a href="' + url + '"' + 'target="_blank"' + '>' + results[0].snippet + '</a>');

}

// Event listener for a new search
$("form").on("submit", function(event){
    event.preventDefault();
    console.log("Submission occured.");
    var imgURL = $("#celebSearchInput").val().trim();
    // MUTE WHEN NEEDING TO AVOID ADDING TO API CALL COUNT
    faceNameAPICall(imgURL);

});

// Event listener for search history (REFER TO NYT ASSIGNMENT)
$("#exampleRecipientInput").on("change", function(){
    console.log("Switching through history.");
    console.log("Option selected = ", $("#exampleRecipientInput").val());

    if($("#exampleRecipientInput").val() === "select_recent") {
        console.log("Default; pick another name");
        return;
    }

    var selectedName = $("#exampleRecipientInput").val();
    var fixName = selectedName;
    var space = " ";
    var spaceFill = "%20";

    fixName = fixName.replace(space, spaceFill);
        

    var searchCeleb = fixName;


    var queryURL = "https://imdb-api.com/en/API/SearchName/" + imdbApiKey + "/" + searchCeleb;

    imdbAPIcall(queryURL, selectedName).then(postMatch);
    // THIS FUNCTION SHOULD EVENTUALLY BE MOVED TO THE END OF POSTMATCH
    // saveMatchHistory(testName);

});

// CURRENTLY NOT WORKING
var renderMatchHistory = function() {
    $("#exampleRecipientInput").empty();

    var matchHistory = JSON.parse(localStorage.getItem("matchHistory")) || [];


    if(matchHistory.length === 0) {
        $("#exampleRecipientInput").append('<option>No Recent Searches</option>');
    }
    else {

        for(var i = 0; matchHistory.length; i++) {
            var name = matchHistory[i];
            $("#exampleRecipientInput").append('<option value="' + name + '">' + name + '</option>');
        }

        
    }

};

var saveMatchHistory = function(searchedName) {
    
    var matchHistory = JSON.parse(localStorage.getItem("matchHistory")) || [];

    if(matchHistory.indexOf(searchedName) > -1) {
        return;
    }
    else {
        matchHistory.unshift(searchedName);
        // Only keep up to five most recent searches
        matchHistory.splice(5);

        localStorage.setItem("matchHistory", JSON.stringify(matchHistory));
    
        // renderMatchHistory();
        $("#exampleRecipientInput").append('<option value="' + searchedName + '">' + searchedName + '</option>');

    }
    
    // var newOption = $("<option></option>").text(searchedName);
    // $(newOption).attr("value", searchedName);
    // $(newOption).appendTo("#exampleRecipientInput");



};
