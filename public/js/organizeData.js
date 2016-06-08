/* ====================================*/
//
//    FUNCTION GROUP 1: Organize Data
//
// ------------------------------------//

function organizeTimesByDate(times){
  //var timesByDate = {};
  setKeyValuePairs(times);
  sortTimes();
  //return timesByDate;

  function setKeyValuePairs(times){
    times.forEach(function(time){
        


        // Won't be needed, once milliseconds are set in DB. 
        setMilliseconds();

        /* TEST METHOD: In production, the milliseconds will already be set in the DB. */
        function setMilliseconds(){
          // Set dummy milliseconds here, for testing. **// TO-DO: How do milliseconds get into the DB?
          var startHourDupe;
          time.startHour == 12 ? startHourDupe = 0 : startHourDupe = time.startHour; 
          if (time.startAmOrPm.toUpperCase() == "PM"){startHourDupe += 12;}

          var endHourDupe;
          time.endHour == 12 ? endHourDupe = 0 : endHourDupe = time.endHour; 
          if (time.endAmOrPm.toUpperCase() == "PM"){endHourDupe += 12;}

          time.startMs = new Date(time.year, time.month, time.dayNum, startHourDupe, time.startMin);          
          time.endMs = new Date(time.year, time.month, time.dayNum, endHourDupe, time.endMin);        
        }

        /* Cut the above function, once milliseconds are set in the DB */




        // If the key doesn't exist in timesByDate, yet, define it with an empty array, so that it may have values pushed into it. 
        if (!timesByDate[(time.month + 1) + "/" + time.dayNum + "/" + time.year]){
          timesByDate[(time.month + 1) + "/" + time.dayNum + "/" + time.year] = [];
        }
        // Push the timeslots from the DB into timesByDate, using a date string made from the day in which the time slots fall as the key.
        timesByDate[(time.month + 1)+ "/" + time.dayNum + "/" + time.year].push(time);
    })
  }
  // Iterate through each array in the "for...in" loop ort each day, use a selection sort on each array, such that the timeslots which comprise the 
  // elements of a given array will be ordered from earliest to latest time slot. This allow for easy display of the timeslots in chronological order. 
  function sortTimes(){
    for(var key in timesByDate){
      var slotsPerDay = timesByDate[key];
      for(var i = 0; i < slotsPerDay.length - 1; i++){
        var indlow = i;
        for(var j = i; j < slotsPerDay.length; j++){
          if (slotsPerDay[j].startMs < slotsPerDay[indlow].startMs){
            indlow = j;
          }
        }
        var temp = slotsPerDay[i];
        slotsPerDay[i] = slotsPerDay[indlow];
        slotsPerDay[indlow] = temp;
      }
      timesByDate[key] = slotsPerDay;
    }
  };  
}