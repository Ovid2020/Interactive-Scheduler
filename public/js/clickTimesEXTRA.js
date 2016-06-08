/*==========================================================================================*/
//|
//|
//|               CLICKABLE MODE: Choosing time slots within a day. 
//|
//|_________________________________________________________________________________________*/

function pickTimesClickableMode(){
  var pickedDay;
  $("#modalBody").empty();
  $("#myModal").removeClass("medWide").addClass("modalWider");
  $(".modal-title").hide();
  $("#clickableShell").appendTo($("#modalBody")).show();

  $(".hourBox").on("mouseover",function(){
    $(".hourBox").css({"margin-top":"1em","opacity":".5"});
    $(this).css({"font-size":"4em","margin-top":"0","opacity":"1"});
  }).on("click",function(){          
    $(this).parents().hasClass("pm") ? $("#clickablePmMinutes").show() : $("#clickableAmMinutes").show();
  }).on("mouseout",function(){
    $(this).css("font-size","3em");  
    $(".hourBox").css({"margin-top":"0","opacity":"1"});
    $(this).parents().hasClass("pm") ? $("#clickablePmMinutes") : $("#clickableAmMinutes");          
  });


  for (var i = firstIndex; i < monthDays[month] + firstIndex; i++){
    (function pickTimesClosure(i){
      $("#day" + i).css("background-color","rgb(213,244,255)").on("click", function(){
        // pickedDay will be the dayNum field of the time object that will be submitted to the DB. 
        pickedDay = $("#dayNum" + i).text();
        $("#myModal").modal("show");
        /*
        // Set a display string at the header of the modal. 
        $("#modalTitleDatePick").text((month + 1) + "/" + $("#dayNum" + i).text() + "/" + year);  
        // Show the modal.
        $("#myModalLabelThree").show();
        */
      });
    })(i);
  }  


}