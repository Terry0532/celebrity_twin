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

    var celebBirthMonth = "December";

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
  birthstoneSelect();

  // function zodiacSelect() {
  //   var celebBirthMonth;
  //   var celebBirthDay;

  //   if (celebBirthMonth === )


  // };
  // zodiacSelect();

  // for dispalying ERROR MODAL:
  function displayModal() {
    var modal = $(".modal");
    modal.addClass("modal-open");
    // closes if X icon or button clicked:
    $(".close-modal").on("click", function() {
        modal.removeClass("modal-open");
    });
    // closes if clicked outside content area:
    $(".modal-inner").on("click", function() {
      modal.removeClass("modal-open");
    });
    // prevents modal inner from closing parent when clicked:
    $(".modal-content").on("click", function(event) {
      event.stopPropagation();
    });
  };
  // displayModal();

});



// NOTES FROM ISSUE16:
// Variables and code need to be fleshed out to receive data from the API AJAX calls and pass them through for dynamic JavaScript. I will continue more of what I was working on with issue14.

// TO-DO FOR JAVASCRIPT: (most of this will be pretty straight-forward once we determine what data we want to get from our API: all of the placeholder fields can exist in the HTML and just be displayed when needed)
// • Make an array variable to take search items and set them into local storage.
// • Make placeholder fields in DISPLAY CARD $("#results") to hold all data we want to retrieve and display from API. These should have data-* tags or IDs to pass in data via an AJAX call.
// • Possibly code a modal to display errors encountered during a search? A "simple" modal designed for the Skeleton.css framework can be found here: https://codepen.io/paulmcclean/pen/YGXWQY.