/* =============================================================*/
//
//    FUNCTION GROUP 2: Initialize the Calendar as a Shell
//
// -------------------------------------------------------------//

// Initialize the calendar as gray blocks with day numbers, with today highlighted with a golden box. The current month will show first. "Next Month"
// and "Previous Month" buttons allow changing the month. No interactivity is set here; it is just a shell, on which functionality will be built.  
function drawMonthShell(month, year, isOverflow){
  // Show the name of the current month. 
  $(".monthLabel").text(monthNames[month] + " " + year);
  // A Date object representing the first day of the current month.
  var firstOfMonth = new Date(year, month, 1);
  // What day of week the first day of the month is. 
  firstIndex = firstOfMonth.getDay();
  // Catch leap years, adjust February accordingly.
  year % 4 == 0 ? monthDays["1"] = 29 : monthDays["1"] = 28;   
  // Call these methods to do the drawing. 
  drawCurrentMonth(isOverflow);

  // The days of the current month start on firstIndex and go till the number of days in that month (monthDays[month]) + firstIndex.
  function drawCurrentMonth(isOverflow){
    drawDays(isOverflow);
    hideOrShowLastRow();
    outlineToday();   

    // Note that drawDays is separate from color-coding days according to available time slots, booked time slots, etc., so that it will be reusable for any color-coding case. 
    function drawDays(isOverflow){
      // This will be a running total of the number of days that follow the days of the current month, if overflow is used.              
      var overflowDayCount = 0;
      // There are 42 cells in the calendar HTML shell. This iterates through, coloring as it goes, all of them. 
      for (var i = 0; i < 42; i++){
        if (i < firstIndex){
          // Either draw faint numbers before the current month's days or draw blanks. 
          isOverflow ? drawBeforeFirstDay(i) : drawBlankDay(i);
        } else if (i < monthDays[month] + firstIndex) {
          // Draw the days of the current month. 
          drawFirstToFinal(i);
        } else {
          // Either draw faint numbers after the current month's days or draw blanks. 
          isOverflow ? drawAfterFinalDay(i) : drawBlankDay(i);
        }
        // Make sure any onclick events from previous months do not carry over to this month. .popover("destroy") is the equivalent of .unbind() for popovers.
        $("#day" + i).unbind().popover("destroy"); ;
      }
      // If isOverflow is true, draw faint numbers on the days before the first day of the current month. 
      function drawBeforeFirstDay(i){  
        // Ensure the previous month to January is December (previous to 0 is 11, not -1). This will be used to draw the final days of the previous month, before the current month's days are drawn. 
        var prevMonth = month > 0 ? month - 1 : 11;  
        // This count will be used to draw the numbers of the start of the next month, after the current month's days are drawn. 
        $("#dayNum" + i).css("color","RGB(200,200,200)").text(monthDays[prevMonth] - (firstIndex - i) + 1); 
        $("#day" + i).css("background-color","RGB(253,253,253)");         
      }
      // Always draw the days of the current month (from first to last day of the current month).
      function drawFirstToFinal(i){
          $("#dayNum" + i).css("color","RGB(120,120,120)").text(i - firstIndex + 1); 
          $("#day" + i).css("background-color","RGB(250,250,250)");  
      }
      // If isOverflow is true, draw faint numbers on the days after the final day of the current month. 
      function drawAfterFinalDay(i){
        overflowDayCount ++;
        $("#dayNum" + i).css("color","RGB(200,200,200)").text(overflowDayCount); 
        $("#day" + i).css("background-color","RGB(253,253,253)"); 
      }
      // If the function is called with isOverflow set to false, the days before the first and after the last days of the month will appear without numbers. 
      function drawBlankDay(i){
        overflowDayCount ++;
        $("#dayNum" + i).css("color","RGB(200,200,200)").text(""); 
        $("#day" + i).css("background-color","RGB(253,253,253)"); 
      }                          
    }  
    // If the sixth row isn't needed to represent the days of the current month, hide it. 
    function hideOrShowLastRow(){
      firstIndex + monthDays[month] <= 35 ? $(".spillover").hide() : $(".spillover").show();
    }          
    // Color today's date with a gold outline; make sure the outline does not carry over to previous/following months. 
    function outlineToday(){
      if (date.getMonth() == month && date.getFullYear() == year){
        var todayIndex = date.getDate() + firstIndex - 1;
        $("#day" + todayIndex).css("box-shadow", "inset 0 2px 10px 10px RGB(253,253,175)");
        // Give today's date a name, so it can be located later. 
        $("#day" + todayIndex).attr("name","today");
      } else {
        // This locates whatever box has the name 'today';
        if ($("[name='today']")){
          // Make sure the outline does not carry over from one month to the next. 
          $("[name='today']").css("box-shadow", "").removeAttr("name");
        }
      }  
    } 
  }         
}