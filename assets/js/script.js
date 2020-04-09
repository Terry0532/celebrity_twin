// GLOBAL VARIABLES FOR USE
// celebrity name found in nameface match and determined user's result
var celebrityResult = "";
// Array where 8 matching names will be stored
var namefaceMatches = [];
// Single name called for specific use
// var namefaceMatch = "";
// boolean value to test match validity
var celebrityFound = false;
// IMDb API Key
var imdbApiKey = "k_Yj7L9aPc";
// Three items we want to grab from the IMDb search and post to site
let matchName = "";
let matchImgURL = "";
let matchDescription = "";
// Used to keep functions waiting until one is completed
//var wait = true;






// Settings and API call to namefaceapi
var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://nameface.p.rapidapi.com/recognize",
    "method": "POST",
    "headers": {
        "x-rapidapi-host": "nameface.p.rapidapi.com",
        "x-rapidapi-key": "efb61b9c88msh61f702c8cf22df2p177bebjsn84ac4de233ec",
        "content-type": "application/json",
        "accept": "application/json"
    },
    "processData": false,
    "data": "{  \"images\": [    \"https://cdn.vox-cdn.com/thumbor/DD8bzlNVAfCggIXvTTvIiG7m2Xw=/0x0:1200x800/1200x800/filters:focal(396x247:588x439)/cdn.vox-cdn.com/uploads/chorus_image/image/65111486/pewds.0.jpg\",\"https://i.ibb.co/2j8cKjV/headshot-alex1.jpg\"]}"
}


var faceNameAPICall = function (settings) {

    $.ajax(settings).done(function (response) {

        console.log(response);
        // Matching names of Alex's photo
        namefaceMatches = [response.images[1].results[0].matches[0].name,
        response.images[1].results[0].matches[1].name,
        response.images[1].results[0].matches[2].name,
        response.images[1].results[0].matches[3].name,
        response.images[1].results[0].matches[4].name,
        response.images[1].results[0].matches[5].name,
        response.images[1].results[0].matches[6].name,
        response.images[1].results[0].matches[7].name];


        checkMatches(namefaceMatches);
    });


}

faceNameAPICall(settings);


// Checking the facename matches in the imdb API
var checkMatches = function (namefaceMatches) {

    //wait = true;
    //console.log("namefaceMatches array = ");
    //console.log(namefaceMatches);

    //return new Promise((resolve, reject) => {        

    // LOOPING THROUGH ALL CELEBS ON LIST
    for (var i = (namefaceMatches.length - 1); i >= 0; i--) {

        const namefaceMatch = namefaceMatches[i];
        //console.log(namefaceMatch);

        // Name is swapped to replace spaces with "%20" in order to pass the whole name through the api search
        var fixName = namefaceMatches[i];
        var space = " ";
        var spaceFill = "%20";

        while (fixName.indexOf(space) > -1) {
            fixName = fixName.replace(space, spaceFill);
        }


        var searchCeleb = fixName;
        // var searchCeleb = namefaceMatches[i];
        // var searchCeleb = "Nelson Mandela";


        var queryURL = "https://imdb-api.com/en/API/SearchName/" + imdbApiKey + "/" + searchCeleb;
        //console.log(queryURL);



        //imdbAPIcall(queryURL).then(postMatch);
        imdbAPIcall(queryURL, namefaceMatch).then(postMatch);



    }

    // Called in event listener
    //postMatch();


    // SINGLE TESTS
    // var searchCeleb = namefaceMatches[0];
    // var queryURL = "https://imdb-api.com/en/API/SearchName/" + imdbApiKey + "/" + searchCeleb;
    // console.log(queryURL);

    // $.ajax({
    //     url: queryURL,
    //     method: "GET",
    //     crossDomain: true,
    //     error: function(err) {
    //         celebrityFound = false;
    //         console.log(err.status);
    //         postMatch();
    //     }
    // }).then(function(response){
    //     celebrityFound = true;
    //     console.log(response);
    //     console.log("results = " + response.result);
    //     postMatch();

    // });


    //wait = false;



    //});
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

            // Setting up conditionals so that we select a match with favorable characteristics
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
                //saveMatchData(response.results[0].title, response.results[0].image, response.results[0].description);
            }

            resolve({ matchName, matchImgURL, matchDescription });


        })
    });
}


// Posting the matched celebrity information to the webpage
var postMatch = function ({ matchName, matchImgURL, matchDescription }) {
    console.log("Mark!");
    console.log("Posting the true match information!");
    console.log("matchName = " + matchName);
    console.log("matchImgURL = " + matchImgURL);
    console.log("matchDescription = " + matchDescription);
    // wikiResult(matchName);
};


var saveMatchData = function (name, imgURL, description) {
    matchName = name;
    console.log("matchName = " + matchName);
    matchImgURL = imgURL;
    console.log("matchImgURL = " + matchImgURL);
    matchDescription = description;
    console.log("matchDescription = " + matchDescription);
}


// Event listener to start search on form submission
$("form").on("submit", function (event) {
    event.preventDefault();
    checkMatches();
    console.log("Moving onto postMatch.")
    postMatch();
});

var test = "Jimmy Smagula";
wikiResult(test);

function wikiResult(matchName) {
    console.log(matchName);
    fetchResult(matchName);
}

function fetchResult(searchQuery) {
    // var endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
    var endpoint = `https://en.wikipedia.org/w/api.php?action=opensearch&limit=10&namespace=0&format=jsonfm&search=${searchQuery}`;
    https://en.wikipedia.org/w/api.php?action=opensearch&search=Hampi&limit=10&namespace=0&format=jsonfm
    console.log(endpoint);
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            const results = data.query.search;
            displayResults(results);
        });
}

function displayResults(results) {
    console.log(results);
}