
/* ================================================================================================================*/
//|
//|
//|    HORIZONTAL SLIDER: Choose specific times from within an offered appointment. 
//|
//|______________________________________________________________________________________________________________//


// Note that this function will chain calls to addListeners, which then sets 
function showDaysWithAvailableTimeSlots(times){
  times.forEach(function(time){
    if (time.month == month && time.year == year){
      var index = firstIndex + time.dayNum - 1;          
      colorCodeDays(time, index, "RGB(200,253,200)");
      addListeners(time, index);
    }  
  }) 
};

// If there are available time slots on a given day, color that day green. 
function colorCodeDays(time, index, color){
  // Color days that haven't yet been colored
  if(!($("#day" + index).hasClass("coloredAvailAppts"))){
    // Days with available timeslots will now appear green. 
    $("#day" + index).addClass("coloredAvailAppts").css("background-color", color);
  } 
}  

// addListeners will make green days clickable and will show a popover when the cursor hovers over green days. 
function addListeners(time, index){
  // Only make these adjustments for days that don't already have listeners added.
  if (!($("#day" + index).hasClass("hasListeners"))){
    $("#day" + index).addClass("hasListeners");
    var dateStr = (time.month + 1) + "/" + time.dayNum + "/" + time.year;
    makeDayClickable();
    setPopOver();

    // Have a direction pop up over the date, when the user hovers the cursor over it.
    function setPopOver(){
      $("#day" + index).popover({trigger: "hover"});
      var numSlots = timesByDate[dateStr].length;
      var slotOrSlots = numSlots > 1 ? "timeslots" : "timeslot";
      var todayOrDate = time.dayNum == date.getDate() ? "today" : dateStr;
      $("#day" + index).attr("data-content","Click here to see the " + numSlots + " available " + slotOrSlots + " for " + todayOrDate + ".");
    }

    // Make available days green. 
    function makeDayClickable(){
      // Click the day (now colored green) to see a modal containing the timeslots for this day. 
      $("#day" + index).unbind().on("click", function(){
        // See below addListeners for this function definition
        return showTimeSlots(dateStr);
      });
    }
  }
}

function showTimeSlots(dateString){
  // Clear previous contents.
  $("#modalBody").empty();
  // "dateString" is used as a key into "timesByDate". The value is an array containing all the time slots for the date in "dateString".
  var timeSlots = timesByDate[dateString];
  var tutorName = timeSlots[0].tutorName;        
  $("#modalTitleName").text(tutorName);
  $(".modalTitleDate").text(dateString);
  //$(".modal-title").text(tutorName + " has the following openings for " + dateString + ": ");
  // For every timeslot, clone the HTML shell for timeslots, customize it, and append it to .modal-body.
  timeSlots.forEach(function(time, i){
    // The timeslotShell markup is set to display:none below the main markup above. Clone it here, giving it a unique id to further customize it. 
    $("#timeslotShell").clone().attr("id","timeslot" + i).appendTo("#modalBody").show();
    // Show the listing number.
    $("#timeslot" + i).find(".listNum").text(i + 1);
    // Show start time for the listing.
    var startTime = time.startHour + ":" + time.startMin + " " + time.startAmOrPm.toUpperCase();           
    $("#timeslot" + i).find(".slotStartShell").text(startTime);
    // Show end time for the listing. 
    var endTime = time.endHour + ":" + time.endMin + " " + time.endAmOrPm.toUpperCase();
    $("#timeslot" + i).find(".slotEndShell").text(endTime);
    // Give the div containing the sliders for selecting specific times a unique id so that it may have its visibility toggled on/off. 
    $("#timeslot" + i).find(".timeSlider").attr("id", "timeSlider" + i);
    // Give the button next to the listing a unique id and an onclick function. The onclick will show the sliders that allow for start and end time selection within this listing. 
    $("#timeslot" + i).find(".slotButton").attr("id", "slotButton" + i).unbind()
        // Toggle view states of buttons and sliders, offer the option to request an appointment. 
        .on("click", function(){
          // Toggle the button of this time slot to stay consistent with user activity. 
          $("#slotButton" + i).text($("#slotButton" + i).text() != "Go Back To Listings" ? "Go Back To Listings" : "Choose A Time From Within These Hours");
          // Toggle the header to reflect user activity.
          $(".modal-title").toggle();
          $(".timeslot").toggle();
          $("#timeslot" + i).toggle();
          $("#timeSlider" + i).fadeToggle();
          // requestAppointment will make an AJAX call to the RESTful API after confirming the user's choice. 
          $(".requestButton").fadeToggle().unbind()
            .on("click", function(){
              // See four lines below, for this function's definition.
              requestAppointment(i);
            });
        });

    $("#timeSlider" + i).find(".slideRange").attr("id","slideRange" + i);
    $("#timeSlider" + i).find(".slideLabels").find(".slideStartLabel").attr("id","slideStartLabel" + i);
    $("#timeSlider" + i).find(".slideLabels").find(".slideEndLabel").attr("id","slideEndLabel" + i);          
    
    initSlider(i);

    function initSlider(i) {

      $("#slideRange" + i).slider({
        range: true,
        min: time.startMs * 1,
        step: (5 * 60000),
        max: time.endMs * 1,
        values: [time.startMs * 1, time.endMs * 1],
        slide: function(event, ui) {
          if ((ui.values[1] - ui.values[0]) < 0){
            //alert("too close!")
            return false;
          } else {
            // formatTime will return strings formatted for display with the slider. 
            var startTime = formatTime(ui.values[0], time.startAmOrPm);
            var endTime = formatTime(ui.values[1], time.endAmOrPm);
            $("#slideHandle" + i + "A").html("<h1 class='handleText startNumber'>" + startTime + "</h1>");   
            $("#slideHandle" + i + "B").html("<h1 class='handleText endNumber'>" + endTime + "</h1>");   
            $("#slideStartLabel" + i).text(startTime);
            $("#slideEndLabel" + i).text(endTime);

            function formatTime(time, amOrPm){
              time = new Date(time);
              var timeMins = time.getMinutes().toString();
              if (timeMins.length == 1){
                timeMins = "0" + timeMins;
              }
              var timeHours = time.getHours();
              var amOrPm;
              if (timeHours >= 12){
                if (timeHours > 12){
                  timeHours -= 12;
                }
                amOrPm = "PM";
              } else {
                amOrPm = "AM";
              }                   
              return timeHours + ":" + timeMins + " " + amOrPm;
            }         
          }
        }
      });
      // Add custom classes to the slider elements. 
      $("#slideRange" + i).find(".ui-slider-handle:first").attr("id","slideHandle" + i + "A").addClass("customSliderHandle").html("<h1 class='handleText startNumber'>" + startTime + "</h1>");
      $("#slideRange" + i).find(".ui-slider-handle:last").attr("id","slideHandle" + i + "B").addClass("customSliderHandle").html("<h1 class='handleText endNumber'>" + endTime + "</h1>");
      $("#slideStartLabel" + i).text(startTime);
      $("#slideEndLabel" + i).text(endTime);      
    };

  })
  $("#myModal").modal("show");
}                    

// Grab the user's selection from this slider, ask for confirmation of the selection, then send an AJAX request to the RESTful API. 
function requestAppointment(i){
  var startTime = new Date($("#slideRange" + i).slider("values",0));
  var endTime = new Date($("#slideRange" + i).slider("values",1));   
  var confirmTime = confirm("You are requesting the following appointment:\n\nStart: " + startTime + "\nEnd: " + endTime + ".\n\n Please click 'Ok' if this is correct, or 'Cancel to select other dates'."); 
  if (confirmTime){
    alert("Submitting start time: " + startTime + "    " + "Submitting end time: " + endTime);
    /*


      AJAX CALL GOES HERE
    

    */
  }           
}






