const pad = (number) => ('0' + number).slice(-2)

const getDate = (month, day) => {
  return `${pad(day)}/${pad(month)}`
}

const getMinutesHrs = (hrs, min) => {
  return `${pad(hrs)}:${pad(min)}`
}

const getYearDayMinHrs = (dateString) => {
  const date = new Date(parseInt(dateString))

  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDay(),
    hrs: date.getHours(),
    min: date.getMinutes(),
  }
}

export const getDateFromString = (sentTime) => {
  const parsed = getYearDayMinHrs(sentTime)

  let dateString = getMinutesHrs(parsed.hrs, parsed.min)

  const dateNow = new Date(Date.now())

  if (parsed.year !== dateNow.getFullYear()) {
    dateString =
      parsed.year + ' ' + getDate(parsed.month, parsed.day) + ' ' + dateString
  } else if (
    parsed.month !== dateNow.getMonth() ||
    parsed.day !== dateNow.getDay()
  ) {
    dateString = getDate(parsed.month, parsed.day) + ' ' + dateString
  }
  return dateString
}
