function appointmentCalendar(mode, inputTimes){

  organizeTimesByDate(inputTimes);

  // This is the callback function for the "Next Month" and "Previous Month" arrow buttons at the top of the page. 
  changeMonth = function(mode){
    // Remove the listeners and color coding from the previously shown month so the shell will start fresh for the currently shown month.
    $(".hasListeners").removeClass("hasListeners");
    $(".coloredAvailAppts").removeClass("coloredAvailAppts");
    switch(mode){
      case "previous":
        month == 0 ? (month = 11, year--) : month--;
        break;
      case "next":
        month == 11 ? (month = 0, year++) : month++;
        break;  
    }
    // Draw next or previous month's shell, then execute the main function to overlap specific functionality on top of the shell. 
    drawMonthShell(month, year, true);
    calendarMainFn(inputTimes);
  }

  // Customize the modal's close button's onclick function to toggle view states. 
  $(".modalClose").on("click", function(){
    $(".requestButton").hide();
    $("#timeslotShell").hide();
  });

  // This sets the main functionality of the plugin, allowing for multiple, distinct usages that hook into/overlap on top of the calendar shell. 
  var calendarMainFn = function(){};

  // Use the user's input to set which function the calendar plugin will call. Each main function will perform some combination of view toggling, style setting, and 
  // button callback defining, allowing the front end to communicate with the server's RESTful API. 
  switch(mode){
    case "requestAppt":
      // Populate timesByDate as an object with the following format: {"dateString#0":[timeslot array#0], "dateString#1":[timeslot array#1], ..."dateString#2":[timeslot array#2]}. 
      // This function will colorcode the days.
      calendarMainFn = showDaysWithAvailableTimeSlots;
      break;
    case "showBookings":
      calendarMainFn = showCurrentBookings;
      break;
    case "pickTimesSliderMode":
      calendarMainFn = pickTimesSliderMode;
      break;
    case "pickTimesClickableMode":
      calendarMainFn = pickTimesClickableMode;
      break;
    case "manageScheduleMode":
      calendarMainFn = manageSchedule;
      break;          
  }         

  // Regardless of what mode will be used for the plugin, the same shell is drawn.     
  drawMonthShell(month, year, true);  
  // Execute the calendar's main function, which has been set according to the user's selected mode. Note: Important to call drawMonthShell before this, as calendarMainFn draws on top of the shell.
  calendarMainFn(inputTimes);      

}




