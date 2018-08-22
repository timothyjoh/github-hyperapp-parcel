export const uniq = ar => ar.filter( (v, i, s) => s.indexOf(v) === i )
export const pluck = (ele) => (arr) => arr.map( a => a[ele] )
export const sortByProp = (p) => (a,b) => a[p] < b[p] ? -1 : (a[p] > b[p] ? 1 : 0)

export const display_time = (stamp) => {
  let currentDate = new Date(stamp),
    day = currentDate.getDate(),
    month = currentDate.getMonth() + 1,
    year = currentDate.getFullYear(),
    hours = currentDate.getHours(),
    minutes = currentDate .getMinutes();

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  let suffix = hours >= 12 ? "PM" : "AM";
  // hours = suffix === 'PM' ? hours - 12 : hours;
  hours = hours === 0 ? 12 : hours;
  return `${year}-${month}-${day} ${hours}:${minutes} ${suffix}`
}

export const time_from_seconds = (time) => {
  let hrs = Math.floor(time / 3600)
  let mins = Math.floor((time % 3600) / 60)
  let secs = Math.round(time % 60)
  let hrstr = hrs > 0 ? `${hrs}h ` : ''
  let minstr = mins > 0 ? `${mins}m ` : ''
  return `${hrstr}${minstr}${secs}s`;
}