export const setTime = (date: Date, timeString: string): Date => {
  var hours = parseInt(timeString.split(":")[0]);
  var minutes = parseInt(timeString.split(":")[1]);
  return new Date(date.setHours(hours, minutes));
};
