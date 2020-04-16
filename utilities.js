// Convert weekly schedule from binary string to a list of days. Ex: "1000110" -> "Sun Thu Fri"
function binaryToStringSchedule(binarySchedule) {
  daysList = ""
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
  time = timeString.substring(0, 5)
  hours = time.substring(0, 2)
  minutes = time.substring(3, 5)

  // This needs to be tested
  if (hours > 12) {
    time = (hours % 12) + ":" + minutes + " PM"
  } else if (hours == 0 || hours == 12) {
    time = "12:" + minutes + " PM"
  } else {
    time = hours + ":" + minutes + " AM"
  }
}

export { binaryToStringSchedule, convert24HourTime }
