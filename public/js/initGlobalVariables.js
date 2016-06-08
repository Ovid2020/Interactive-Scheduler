
 
  // Initialize this here, defined within appointmentCalendar. Used as onclick buttons for the "Next Month" and "Previous Month" buttons.
  var changeMonth = function(){};

  // Dummy array. These will be populated from an AJAX call to the RESTful API.
  const freeTimes = [
    {"dayNum":24, "month":4, "year":2016, "id": 2,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":5, "startMin":"00","startAmOrPm":"PM","endHour":6,"endMin":"00","endAmOrPm":"PM","startMs":2,"endMs":4},
    {"dayNum":24, "month":4, "year":2016, "id": 1, "tutorName":"JamesBond", "learnerName":"Hector334", "startHour":8, "startMin":"05","startAmOrPm":"AM","endHour":8,"endMin":45,"endAmOrPm":"AM","startMs":1,"endMs":3},
    {"dayNum":23, "month":4, "year":2016, "id": 1,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":10, "startMin":30,"startAmOrPm":"PM","endHour":12,"endMin":30,"endAmOrPm":"AM","startMs":1,"endMs":3},      
    {"dayNum":2, "month":4, "year":2015, "id": 1,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":3, "startMin":30,"startAmOrPm":"PM","endHour":4,"endMin":30,"endAmOrPm":"PM","startMs":1,"endMs":3},
    {"dayNum":29, "month":1, "year":2016, "id": 1,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":3, "startMin":30,"startAmOrPm":"PM","endHour":4,"endMin":30,"endAmOrPm":"PM","startMs":1,"endMs":3},
    {"dayNum":3, "month":3, "year":2016, "id": 1,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":3, "startMin":30,"startAmOrPm":"PM","endHour":4,"endMin":30,"endAmOrPm":"PM","startMs":1,"endMs":3},
    {"dayNum":28, "month":10, "year":2016, "id": 1,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":3, "startMin":30,"startAmOrPm":"PM","endHour":4,"endMin":30,"endAmOrPm":"PM","startMs":1,"endMs":3},
    {"dayNum":20, "month":4, "year":2016, "id": 1,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":8, "startMin":40,"startAmOrPm":"am","endHour":12,"endMin":"00","endAmOrPm":"pM","startMs":1,"endMs":3},      
    {"dayNum":20, "month":4, "year":2016, "id": 4,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":11, "startMin":10,"startAmOrPm":"aM","endHour":2,"endMin":30,"endAmOrPm":"PM","startMs":4,"endMs":3},
    {"dayNum":20, "month":4, "year":2016, "id": 3,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":5, "startMin":"00","startAmOrPm":"PM","endHour":6,"endMin":30,"endAmOrPm":"PM","startMs":3,"endMs":3},      
    {"dayNum":20, "month":4, "year":2016, "id": 5,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":8, "startMin":30,"startAmOrPm":"PM","endHour":9,"endMin":30,"endAmOrPm":"PM","startMs":5,"endMs":3},
    {"dayNum":20, "month":4, "year":2016, "id":2,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":3, "startMin":30,"startAmOrPm":"PM","endHour":4,"endMin":30,"endAmOrPm":"PM","startMs":2,"endMs":3}
  ];

  const myTimes = [
    {"dayNum":21, "month":4, "year":2016, "id": 2,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":1, "startMin":"00","startAmOrPm":"PM","endHour":3,"endMin":"00","endAmOrPm":"PM","startMs":2,"endMs":4},
    {"dayNum":21, "month":4, "year":2016, "id": 1, "tutorName":"JamesBond", "learnerName":"Hector334", "startHour":2, "startMin":"05","startAmOrPm":"AM","endHour":4,"endMin":45,"endAmOrPm":"AM","startMs":1,"endMs":3},
    {"dayNum":21, "month":4, "year":2016, "id": 1,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":2, "startMin":30,"startAmOrPm":"PM","endHour":11,"endMin":30,"endAmOrPm":"PM","startMs":1,"endMs":3},      
    {"dayNum":21, "month":4, "year":2015, "id": 1,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":9, "startMin":30,"startAmOrPm":"PM","endHour":10,"endMin":30,"endAmOrPm":"PM","startMs":1,"endMs":3},
    {"dayNum":29, "month":2, "year":2016, "id": 1,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":3, "startMin":30,"startAmOrPm":"PM","endHour":4,"endMin":30,"endAmOrPm":"PM","startMs":1,"endMs":3},
    {"dayNum":3, "month":11, "year":2015, "id": 1,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":3, "startMin":30,"startAmOrPm":"PM","endHour":4,"endMin":30,"endAmOrPm":"PM","startMs":1,"endMs":3},
    {"dayNum":20, "month":6, "year":2016, "id": 1,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":3, "startMin":30,"startAmOrPm":"PM","endHour":4,"endMin":30,"endAmOrPm":"PM","startMs":1,"endMs":3},
    {"dayNum":22, "month":4, "year":2016, "id": 1,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":8, "startMin":40,"startAmOrPm":"am","endHour":12,"endMin":"00","endAmOrPm":"pM","startMs":1,"endMs":3},      
    {"dayNum":23, "month":4, "year":2016, "id": 4,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":11, "startMin":10,"startAmOrPm":"aM","endHour":2,"endMin":30,"endAmOrPm":"PM","startMs":4,"endMs":3},
    {"dayNum":24, "month":4, "year":2016, "id": 3,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":5, "startMin":"00","startAmOrPm":"PM","endHour":6,"endMin":30,"endAmOrPm":"PM","startMs":3,"endMs":3},      
    {"dayNum":25, "month":4, "year":2016, "id": 5,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":8, "startMin":30,"startAmOrPm":"PM","endHour":9,"endMin":30,"endAmOrPm":"PM","startMs":5,"endMs":3},
    {"dayNum":29, "month":5, "year":2016, "id":2,"tutorName":"JamesBond", "learnerName":"Hector334", "startHour":3, "startMin":30,"startAmOrPm":"PM","endHour":4,"endMin":30,"endAmOrPm":"PM","startMs":2,"endMs":3}
  ]; 

  const monthDays = {
    "0": 31,
    "1": 28,
    "2": 31,
    "3": 30,
    "4": 31,
    "5": 30,
    "6": 31,
    "7": 31,
    "8": 30,
    "9": 31,
    "10": 30,
    "11": 31
  };

  const monthNames = {
    "0": "January",
    "1": "February",
    "2": "March",
    "3": "April",
    "4": "May",
    "5": "June",
    "6": "July",
    "7": "August",
    "8": "September",
    "9": "October",
    "10": "November",
    "11": "December"
  }

  // firstIndex is used to tell later functions where the first day of the month will start. This is needed because the first day of the month will not always fall on index 0 of the calendar shell 
  // -- i.e., if the first day of the month is on a Wednesday, a 1 must appear in the dayNum div in this day div, even though the index of the first Wednesday in the calendar shell is 3. 
  var firstIndex;  
  var date = new Date();
  var month = date.getMonth();
  var year = date.getFullYear();

  // Populate timesByDate as an object with the following format: {"dateString#0":[timeslot array#0], "dateString#1":[timeslot array#1], ..."dateString#2":[timeslot array#2]}. 
  // This function will colorcode the days. 
  var timesByDate = {};                                     