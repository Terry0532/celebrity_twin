// GLOBAL VARIABLES FOR USE
// Array where matching names will be stored
var namefaceMatches = [];
// IMDb API Key
var imdbApiKey = "k_Yj7L9aPc";
// Three items we want to grab from the IMDb search and post to site
var matchName = "";
var matchImgURL = "";
var matchDescription = "";
// SECONDARY API KEY FOR NAMEFACE API
var namefaceSecondaryAPIKey = "efc5acba70mshee51db23cc82531p1bffd9jsn8e339ffa933d";
//store uploaded img url
var uploadedImageUrl;
//delete uploaded img
var deleteImageHash;

localStorage.clear();


// FUNCTIONS

function displayModal() {
    var modal = $(".modal");
    modal.addClass("modal-open");
    // closes if X icon or button clicked:
    $(".close-modal").on("click", function () {
        modal.removeClass("modal-open");
    });
    // closes if clicked outside content area:
    $(".modal-inner").on("click", function () {
        modal.removeClass("modal-open");
    });
    // prevents modal inner from closing parent when clicked:
    $(".modal-content").on("click", function (event) {
        event.stopPropagation();
    });
};

// Settings and API call to namefaceapi
// IN SETTINGS FIND WAY TO USE displayModal FUNCTION WHEN ERROR OCCURS
var faceNameAPICall = function (imgURL) {
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
        "data": "{  \"images\": [\"" + imgURL + "\"]}"
    }
    // If they try searching without an input, we want to return
    if (imgURL === "") {
        displayModal();
        return;
    } else {
        $.ajax(settings).done(function (response) {
            var numOfMatches = response.images[0].results[0].matches.length;

            for (var i = 0; i < numOfMatches; i++) {
                namefaceMatches[i] = response.images[0].results[0].matches[i].name;
            }
            // Now that we have our matching names results, start testing on imdb api
            checkMatches(namefaceMatches);
        });
    }
}

// Checking the facename matches in the imdb API
var checkMatches = function (namefaceMatches) {

    // LOOPING THROUGH ALL CELEBS ON LIST
    for (var i = (namefaceMatches.length - 1); i >= 0; i--) {

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
                matchName = response.results[0].title;
                matchImgURL = response.results[0].image;
                matchDescription = response.results[0].description;
            }

            resolve({ matchName, matchImgURL, matchDescription });

        })
    });
};

// Posting the matched IMDb information to the webpage
var postMatch = function ({ matchName, matchImgURL, matchDescription }) {

    //hide loading spinner
    $("#submitSpinner").addClass("d-none");

    // Appending the data to the html card
    $("#celebResult").html(matchName);
    $("#celebImage").attr("src", matchImgURL);
    $("#celebDOB").html(matchDescription);
    saveMatchHistory(matchName);
    // Once IMDb results are posted, search and post the wikipedia results
    wikiResult(matchName);
};

// to find results from wikipedia api
function wikiResult(matchName) {
    var endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${matchName}`;
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            const results = data.query.search;
            displayResults(results);
            deleteUpload(deleteImageHash);
        });
}

// display wikipedia results
function displayResults(results) {
    var url = encodeURI(`https://en.wikipedia.org/wiki/${results[0].title}`);
    $("#celebWikiResult").html('<a href="' + url + '"' + 'target="_blank"' + '><i class="fab fa-wikipedia-w"></i></a>');
}


var saveMatchHistory = function (searchedName) {

    var matchHistory = JSON.parse(localStorage.getItem("matchHistory")) || [];

    if (matchHistory.indexOf(searchedName) > -1) {
        return;
    }
    else {
        matchHistory.unshift(searchedName);
        // Only keep up to five most recent searches
        // matchHistory.splice(5);

        localStorage.setItem("matchHistory", JSON.stringify(matchHistory));

        $("#exampleRecipientInput").append('<option value="' + searchedName + '">' + searchedName + '</option>');

    }
};


// Delete link upload to the submission
function deleteUpload(deleteImageHash) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Client-ID 93e7eb73da70d74");
    var apiURL = "https://api.imgur.com/3/image/" + deleteImageHash;

    var formdata = new FormData();

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    fetch(apiURL, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
};

function uploadImage($files) {
    if ($files.length) {

        var apiUrl = 'https://api.imgur.com/3/image';
        var apiKey = '93e7eb73da70d74';

        var settings = {
            async: true,
            crossDomain: true,
            processData: false,
            contentType: false,
            type: 'POST',
            url: apiUrl,
            headers: {
                Authorization: 'Client-ID ' + apiKey,
                Accept: 'application/json'
            },
            mimeType: 'multipart/form-data'
        };

        var formData = new FormData();
        formData.append("image", $files[0]);
        settings.data = formData;

        $.ajax(settings).done(function (response) {

            //hide loading spinner
            $("#uploadSpinner").addClass("d-none");

            uploadedImageUrl = JSON.parse(response).data.link;
            $("#celebSearchInput").val(uploadedImageUrl);
            deleteImageHash = JSON.parse(response).data.deletehash;
        });
    }
}

// EVENT LISTENERS

// Event listener for a new search
$("form").on("submit", function (event) {
    event.preventDefault();

    //show loading spinner
    $("#submitSpinner").removeClass("d-none");

    var imgURL = $("#celebSearchInput").val().trim();
    // MUTE WHEN NEEDING TO AVOID ADDING TO API CALL COUNT
    faceNameAPICall(imgURL);
});

// Event listener for search history
$("#exampleRecipientInput").on("change", function () {
    console.log("Switching through history.");
    console.log("Option selected = ", $("#exampleRecipientInput").val());

    if ($("#exampleRecipientInput").val() === "select_recent") {
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
});


// When user clicks to upload an image
$(document).on("click", ".submitFile", function (event) {
    event.preventDefault();

    //show loading spinner
    $("#uploadSpinner").removeClass("d-none");

    var $files = $(".uploadFile").get(0).files;

    uploadImage($files);
});

