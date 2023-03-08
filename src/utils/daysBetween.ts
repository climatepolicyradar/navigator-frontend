export const daysBetween = function (date1: number, date2: number) {
  // 1 day in milliseconds
  var one_day = 1000 * 60 * 60 * 24;

  // calculate the difference in milliseconds
  var difference_ms = date2 - date1;

  // convert back to nearest days and return
  return Math.round(difference_ms / one_day);
};
