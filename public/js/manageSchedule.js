/*==========================================================================================*/
//|
//|
//|               SCHEDULE MANAGER MODE: Choosing time slots within a day. 
//|
//|_________________________________________________________________________________________*/

function manageSchedule(){

  // Prep the modal for showing the schedule. It will not be made visible till a day is clicked. 
  $(".modal-title").hide();
  $("#scheduleShell").appendTo($("#modalBody")).show();
  $("#myModal").removeClass("medWide").addClass("modalWider");
  $("#modalCloseButton").on("click", function(){
    // Remove the timeslots that were showing from previous activity. 
    $(".timeoverlay").remove();          
  })

  var startTime;
  var endTime;

  // The user will populate this array with free times created on the GUI. 
  var newTimes = [];

  var pickedDay, pickedMonth = month, pickedYear = year;

  for (var i = firstIndex; i < monthDays[month] + firstIndex; i++){
    (function pickTimesClosure(i){
      $("#day" + i).css("background-color","rgb(213,244,255)").on("click", function(){

        // pickedDay will be the dayNum field of the time object that will be submitted to the DB. 
        pickedDay = $("#dayNum" + i).text();
        // Set the header date.
        $("#headerMonth").text(pickedMonth + 1); 
        $("#headerDay").text(pickedDay);
        $("#headerYear").text(pickedYear);   
        // Append the schedule to the modal and show it (schedule is hidden, by default).             
        $("#myModal").modal("show");

        // Delay the drawing to let the above functions set up the modal, as drawExistingSlots depeneds on the modal's dimensions
        // to be correctly set. 
        setTimeout(function(){
          if (timesByDate[(month + 1) + "/" + pickedDay + "/" + year]){
            timesByDate[(month + 1) + "/" + pickedDay + "/" + year].forEach(function(slot){
              drawTimeslot(slot);
            })
          }
        }, 175)
      });
    })(i);
  }  

  $("button.changeDay").on("click", function(){

    // Remove the timeslots that were showing from the previously displayed day. 
    $(".timeoverlay").remove();

    // The left arrow decrements the day, the right arrow increments it.
    $(this).hasClass("btn-arrow-left") ? pickedDay-- : pickedDay++;

    // Ensure the final day of the previous month follows the first day of the current month.
    if (pickedDay < 1){
      pickedMonth-- ;
      if (pickedMonth < 0){
        pickedMonth = 11;
        pickedYear-- ;
      } 
      pickedDay = monthDays[pickedMonth];
    } 
      // Ensure the first day of the next month follows the final day of the current month.
      else if (pickedDay > monthDays[pickedMonth]){
      pickedMonth++;
      if (pickedMonth > 11){
        pickedMonth = 0;
        pickedYear++;
      }
      pickedDay = 1;
    }          

    // If there are any timeslots present in the current day (loaded from DB), draw them. 
    if (timesByDate[(pickedMonth + 1) + "/" + pickedDay + "/" + pickedYear]){
      timesByDate[(pickedMonth + 1) + "/" + pickedDay + "/" + pickedYear].forEach(function(slot){
        drawTimeslot(slot);
      })
    }  

    // Update the header with every change.
    $("#headerMonth").text(pickedMonth + 1); 
    $("#headerDay").text(pickedDay);
    $("#headerYear").text(pickedYear);  

  });

  $("#scheduleSlider").slider({
    range: true,
    min: 0,
    step: (1/12),
    max: 24,// 24 goes onto the next day.
    values: [8, 14],
    slide: function(event, ui) {
      if ((ui.values[1] - ui.values[0]) < 0){
        //alert("too close!")
        //return false;
      /*  
      } else if (ui.values[1] > 23.75){
        //return false;
      */
      } else {
        // Assign the times with every slide. 
        startTime = ui.values[0];
        endTime = ui.values[1];
        // leftLine gives the vertical blue line above and below the centers of the slider handles. 
        $("#schedSliderHandleA").html("<div class='leftLine lineTop'>&nbsp</div><div class='leftLine lineBottom'>&nbsp</div>" +  
          "<h1 class='handleText startNumber'>" + formatTime(startTime, "start") + "</h1>");
        $("#schedSliderHandleB").html("<div class='leftLine lineTop'>&nbsp</div><div class='leftLine lineBottom'>&nbsp</div>" + 
          "<h1 class='handleText endNumber'>" + formatTime(endTime, "end") + "</h1>");         
      }
    }
  })

  // Add custom classes to the slider elements and give them a default text. They must be initialized above before these can be set.
  $("#scheduleSlider").find(".ui-slider-handle:first").attr("id","schedSliderHandleA").addClass("schedSliderHandle")
      .html("<h1 class='handleText startNumber'>Pick Start</h1>");
  $("#scheduleSlider").find(".ui-slider-handle:last").attr("id","schedSliderHandleB").addClass("schedSliderHandle")
      .html("<h1 class='handleText endNumber'>Pick End</h1>");

  $("#schedButton").on("click", function(){
    createNewTimeslot();
  })

  // Format times for display on the slider handles.
  function formatTime(time, startOrEnd){
    var amOrPm;
    if (time > 12){
      time -= 12;
      amOrPm = "PM";
    } else {
      amOrPm = "AM";
    }
    var hour = Math.floor(time);
    var minutes = (((time - hour) * 60).toFixed(0)).toString();
    if (hour == 0){hour += 12};                
    if (minutes.length == 1) {minutes = "0" + minutes};
    return hour + ":" + minutes + " " + amOrPm;

  }

  function createNewTimeslot(){

    var newSlot = getNewSlotData();
    //console.log(newSlot)
    //checkOverlaps(newSlot);
    //checkConflicts(newSlot);
    //console.log(newTimes)          
    drawTimeslot(newSlot);

    // Grab data from the DOM values which the user has chosen. 
    function getNewSlotData(){

      var startTimeString = $("#schedSliderHandleA").find(".handleText").text();
      var endTimeString = $("#schedSliderHandleB").find(".handleText").text();

      var startTimeParts = startTimeString.split(":");
      var endTimeParts = endTimeString.split(":");

      var startTimeParts2 = startTimeParts[1].split(" ");
      var endTimeParts2 = endTimeParts[1].split(" ");

      var startHour = Number(startTimeParts[0]);
      if (startHour === 12){startHour -= 12};
      if (startTimeParts2[1] === "PM"){startHour += 12};
      var startMin = Number(startTimeParts2[0]);


      var endHour = Number(endTimeParts[0]);
      if (endHour === 12){startHour -= 12};
      if (endTimeParts2[1] === "PM"){endHour += 12};            
      var endMin = Number(endTimeParts2[0]);

      var startDate = new Date(year, month, pickedDay, startHour, startMin);
      var endDate = new Date(year, month, pickedDay, endHour, endMin);

      // Dummy object. Will come from the server. 
      var principal = {username : "Hector334"};
      var newTime = {};

      newTime.learnerName = principal.username;
      newTime.dayNum = pickedDay;
      newTime.month = month;
      newTime.year = year; 
      newTime.startHour = startHour;
      newTime.startMin = startMin;
      newTime.startAmOrPm = startTimeParts2[1];
      newTime.startMs = startDate;
      newTime.endHour = endHour;
      newTime.endMin = endMin;
      newTime.endAmOrPm = endTimeParts2[1];
      newTime.endMs = endDate;

      return newTime;
    }

    function checkOverlaps(newTime){
      // If two lines are drawn on the same number line, and the larger of the two starting values is smaller than the lesser of the two  
      // finishing values, then the two lines overlap. Use that logic to check if the times overlap.  
      var smallerEnd;
      var largerStart;
      if (newTimes.length === 0){
        newTimes.push(newTime);              
      }
      newTimes.forEach(function(extant){
        // Get the smaller of the two end times (order doesn't matter).
        smallerEnd = extant.endMs < newTime.endMs ? extant.endMs : newTime.endMs;
        // Get the larger of the two start times (order doesn't matter).
        largerStart = extant.startMs > newTime.startMs ? extant.startMs : newTime.startMs;
        // If this is true, then the two timeslots overlap. Update the existing entry to reflect the new (overlapping) selection. 
        console.log(smallerEnd + "  " + largerStart)
        if (smallerEnd > largerStart){
          alert("what to do now?")
        } else {
          newTimes.push(newTime);
        }
      })
    }

    function checkConflicts(newTime){

    }
  }

  function drawTimeslot(slot){
    
    // Use the slot's times, relative to a 24 hour day, to determine its position on the modal's body. 
    var startTime = slot.startMs.getHours() + slot.startMs.getMinutes()/60;
    var endTime = slot.endMs.getHours() + slot.endMs.getMinutes()/60;
    // The offsets are in pixels, using the time values relative to a whole day (24 hours), multiplied by the whole width
    // of the schedule's body div. 
    var startOffset = (startTime / 24) * $("#topRow").width() - 1; 
    var endOffset = (endTime / 24) * $("#topRow").width();
    var timeDivWidth = endOffset - startOffset - 2; // - 2 is to accommodate the pixel of borders.

    var $div = $("<div></div>", {"class":"timeOverlay", "width": timeDivWidth});
    $div.appendTo($("#topRow")).css({"margin-left": (startOffset), "top": ($(".schedBody").height() / 7)});            
  }              
}