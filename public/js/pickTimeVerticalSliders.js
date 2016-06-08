/*==========================================================================================*/
//|
//|
//|               TWO VERTICAL SLIDERS: Choosing time slots within a day. 
//|
//|_________________________________________________________________________________________*/

function pickTimesSliderMode(){
  var timesForDb = [];
  var pickedTime = {};
  // This will be set when a day is clicked. 
  var pickedDay;
  $("#modalBody").empty();
  $(".modal-title").hide();
  $("#pickTimeShell").appendTo($("#modalBody")).show();

  // Go through all the days of the currently displayed month and give them all the onclick function that will trigger the modal to 
  // show the time selection view for the current day. 
  for (var i = firstIndex; i < monthDays[month] + firstIndex; i++){
    (function pickTimesClosure(i){
      $("#day" + i).css("background-color","rgba(255,0,255,.2)").on("click", function(){
        // pickedDay will be the dayNum field of the time object that will be submitted to the DB. 
        pickedDay = $("#dayNum" + i).text();
        $("#myModal").modal("show");
        // Set a display string at the header of the modal. 
        $("#modalTitleDatePick").text((month + 1) + "/" + $("#dayNum" + i).text() + "/" + year);  
        // Show the modal.
        $("#myModalLabelThree").show();
      });
    })(i);
  }        

  // Initialize the vertical slider that will select hours.
  $( "#pickHourSlider" ).slider({
    orientation: "vertical",
    range: "min",
    min: 1,
    max: 12,
    value: 1,
    step: 1,
    slide: function( event, ui ) {
      $("#hourSliderHandleHeader").text(ui.value);
      $("#pickHours").val(ui.value);  
      enableSubmitButton();                                                 
    }
  });

  // Initialize the vertical slider that will select minutes.
  $( "#pickMinuteSlider" ).slider({
    orientation: "vertical",
    range: "min",
    min: 0,
    max: 59,
    value: 0,
    step: 5,
    slide: function( event, ui ) {
      var minutes = ui.value <= 9 ? "0" + ui.value : ui.value;
      // The class is changed to one that takes up less space so that the AM/PM display won't be so far from the numbers. 
      if ($("#pickMinutesContainer").hasClass("col-md-3")){
        $("#pickMinutesContainer").switchClass("col-md-3","col-md-1");
      }

      $("#minuteSliderHandleHeader").text(ui.value);
      //$("#minuteSliderHandle").html("<h1 class='handleText-Vertical startNumber'>" + minutes + "</h1>");
      $("#pickMinutes").val(minutes);   
      enableSubmitButton();                             
    }
  });        

  // Set the AM or PM display to the value of the select tag.
  $("#pickAmPmSelect").on("change",function(){
    $("#pickAmPm").val($("#pickAmPmSelect").val());
    enableSubmitButton();                             
  })

  // Initialize the settings for views when the modal is first visible. (Must come after the sliders are initialized above.)
  $(".pickSlider").find(".ui-slider-handle").addClass("customSliderHandle-Vertical");
  $("#pickHourSlider").find(".ui-slider-handle").attr("id","hourSliderHandle")
                      .html("<h1 id='hourSliderHandleHeader' class='handleText-Vertical startNumber reuse'>1</h1>");      
  $("#pickMinuteSlider").find(".ui-slider-handle").attr("id","minuteSliderHandle")
                      .html("<h1 id='minuteSliderHandleHeader'class='handleText-Vertical startNumber reuse'>00</h1>"); 

  // This assigns an onclick function to the button below the vertical sliders. The first time it is clicked, it stores the 
  // time as the start of a time block, then resets the view. The second time it is clicked, it stores the time as the end of 
  // the time block that was started before, then resets the view. The third time it is clicked, it submits this time block 
  // to the server in an AJAX POST, then restores the view to its start place.  
  function enableSubmitButton(){
    // Only enable the submit button if all three inputs have been given values (by user activity).
    if ($("#pickMinutes").val() && $("#pickHours").val() && $("#pickAmPm").val()) {  
      
      // Set the onclick button for the button next to the time selection, which will store the current time. 
      $("#pickTimeButton").show().unbind().on("click",function(){
        // The current class of #pickTimeShell will indicate what this function will do.
        chooseButtonActionBasedOnClass();
      });
    }

    function chooseButtonActionBasedOnClass(){
      // The current state of pickTimeShell (represented by its class) will be used to create the correct part of the 
      // time object which will then be submitted to the server in a POST call. 
      switch($("#pickTimeShell").attr("class")){
        case "row default":
          // Define the fields of pickedTime which relate to the start time. 
          pickedTime.dayNum = pickedDay;
          pickedTime.month = month;
          pickedTime.year = year;
          pickedTime.learnerName = "Hector334";//from principal.username();
          pickedTime.startHour = $("#pickHours").val();
          pickedTime.startMin = $("#pickMinutes").val(); 
          pickedTime.startAmPm = $("#pickAmPm").val();
          var hour = pickedTime.startHour == 12 ? 0 : pickedTime.startHour;
          hour = pickedTime.startAmPm == "PM" ? (hour * 1) + 12 : hour;
          pickedTime.startMs = new Date(year, month, pickedDay, hour, pickedTime.startMin);   
          // Change the DOM states, as appropriate, to ready the view for selecting the end time.
          $("#modalTitlePickText").text("Now, Choose an End Time for ");
          $("#pickTimeShell").find(".reuse").removeClass("startNumber").addClass("endNumber");                                            
          $("#pickTimeShell").removeClass("default").addClass("startTimeHasBeenPicked");                
          break;
        case "row startTimeHasBeenPicked":
          // Define the fields of pickedTime which related to the end time. 
          pickedTime.endHour = $("#pickHours").val();
          pickedTime.endMin = $("#pickMinutes").val(); 
          pickedTime.endAmPm = $("#pickAmPm").val();
          hour = pickedTime.endHour == 12 ? 0 : pickedTime.endHour;
          hour = pickedTime.endAmPm == "PM" ? (hour * 1) + 12 : hour;
          pickedTime.endMs = new Date(year, month, pickedDay, hour, pickedTime.endMin);

          // Make sure the end of the time slot is after the start of it. 
          if (pickedTime.startMs >= pickedTime.endMs){
            alert("Please make sure your end time is later than your start time of: " + pickedTime.startMs);
          } else {
            // Change the DOM states, as appropriate, to ready the view for submitting this time slot.
            $("#pickTimeShell").removeClass("startTimeHasBeenPicked").addClass("endTimeHasBeenPicked");                                  
            $("#pickTimeSlot").hide();                                      
            $("#modalTitlePickText").text("Review Your Selection for ");

            // Set the hidden input texts to show the user's start time. 
            $("#hiddenPickHours").val(pickedTime.startHour);
            $("#hiddenPickMinutes").val(pickedTime.startMin);
            $("#hiddenPickAmPm").val(pickedTime.startAmPm);
            $("#hiddenTextContainer").show();
            $("#endTimeLabel").css("visibility","visible");
          }
          break; 
        case "endTimeHasBeenPicked":
            $("#pickTimeShell").removeClass("endTimeHasBeenPicked").addClass("default");                                  
            alert("hi!")
            /*


              AJAX POST OF PICKTIME GOES HERE 


            */  
          break;  
      }            
    }
  }
} 