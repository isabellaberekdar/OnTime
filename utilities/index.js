import moment from "moment"

// Convert weekly schedule from binary string to a list of days. Ex: "1000110" -> "Sun Thu Fri"
function binaryToStringSchedule(binarySchedule) {
  let daysList = ""
  if (binarySchedule[0] === "1") {
    daysList += "Sun "
  }
  if (binarySchedule[1] === "1") {
    daysList += "Mon "
  }
  if (binarySchedule[2] === "1") {
    daysList += "Tue "
  }
  if (binarySchedule[3] === "1") {
    daysList += "Wed "
  }
  if (binarySchedule[4] === "1") {
    daysList += "Thu "
  }
  if (binarySchedule[5] === "1") {
    daysList += "Fri "
  }
  if (binarySchedule[6] === "1") {
    daysList += "Sat"
  }
  return daysList
}

// Convert a string like "10:11:00" to "10:11 AM"
function convert24HourTime(timeString) {
  // Remove ":00" from end of string
  let time = timeString.substring(0, 5)
  const hours = time.substring(0, 2)
  const minutes = time.substring(3, 5)

  // This needs to be tested
  if (hours > 12) {
    time = (hours % 12) + ":" + minutes + " PM"
  } else if (hours == 0) {
    time = "12:" + minutes + " AM"
  } else {
    time = hours + ":" + minutes + " AM"
  }
  return time
}

// Format time from a UTC Date object to: Tuesday 28 April 2020 6:06PM
function formatDateTimeEnglishEST(date) {
  return moment(date).format("dddd MMMM DD YYYY h:mm A")
}
// Format time from a UTC Date object to: Tuesday 28 April 2020
function formatDateEnglishEST(date) {
  return moment(date).format("dddd MMMM DD YYYY")
}

// Format time from a UTC Date object to: 2020-04-28
function formatDateEST(date) {
  return moment(date).format("YYYY-MM-DD")
}

// Format time from a UTC Date object to: 06:28:00
function formatTimeEST(date) {
  return moment(date).format("HH:mm") + ":00"
}

export {
  binaryToStringSchedule,
  convert24HourTime,
  formatDateTimeEnglishEST,
  formatDateEnglishEST,
  formatDateEST,
  formatTimeEST
}
