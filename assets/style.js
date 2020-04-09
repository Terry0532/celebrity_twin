$(document).ready(function(){

  // Display search results:
  function dispResults() {
    // displays HORIZONTAL RULE to separate search from result:
    $("form").after("<hr>");
    // makes DISPLAY CARD visible:
    $("#results").prop("hidden", false);
  };
  // dispResults();

  // Adjusts color of birthstone icon to match birth month:
  function birthstoneSelect() {
    var celebBirthMonth;

    if (celebBirthMonth === "January") {
      $(".birthstone").attr("id", "janGarnet");
    } else if (celebBirthMonth === "February") {
      $(".birthstone").attr("id", "febAmethyst");
    } else if (celebBirthMonth === "March") {
      $(".birthstone").attr("id", "marBloodstone");
    } else if (celebBirthMonth === "April") {
      $(".birthstone").attr("id", "aprDiamond");
    } else if (celebBirthMonth === "May") {
      $(".birthstone").attr("id", "mayEmerald");
    } else if (celebBirthMonth === "June") {
      $(".birthstone").attr("id", "junPearl");
    } else if (celebBirthMonth === "July") {
      $(".birthstone").attr("id", "julRuby");
    } else if (celebBirthMonth === "August") {
      $(".birthstone").attr("id", "augPeridot");
    } else if (celebBirthMonth === "September") {
      $(".birthstone").attr("id", "sepSapphire");
    } else if (celebBirthMonth === "October") {
      $(".birthstone").attr("id", "octOpal");
    } else if (celebBirthMonth === "November") {
      $(".birthstone").attr("id", "novTopaz");
    } else {
      $(".birthstone").attr("id", "decTurquoise");
    }
  };
  // birthstoneSelect();

  // function zodiacSelect() {
  //   var celebBirthMonth;
  //   var celebBirthDay;

  //   if (celebBirthMonth === )


  // };
  // zodiacSelect();
});



// NOTES FROM ISSUE14:
// We'll need a rough JavaScript framework to make our HTML dynamic, so I will start building these template functions in the "style.js" (versus the "script.js") file. These can later be integrated into one stylesheet.//

// TO-DO FOR JAVASCRIPT: (most of this will be pretty straight-forward once we determine what data we want to get from our API: all of the placeholder fields can exist in the HTML and just be displayed when needed)
// • Make an array variable to take search items and set them into local storage.
// • Make placeholder fields in DISPLAY CARD $("#results") to hold all data we want to retrieve and display from API. These should have data-* tags or IDs to pass in data via an AJAX call.
// • Possibly code a modal to display errors encountered during a search? A "simple" modal designed for the Skeleton.css framework can be found here: https://codepen.io/paulmcclean/pen/YGXWQY.