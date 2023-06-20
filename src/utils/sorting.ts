export type SortFuncType = (data: any, prop: any) => any;

export const sortData = (data, prop) => {
  var myData = data.sort((a, b) => {
    if (a[prop] < b[prop]) {
      return -1;
    }
    if (a[prop] > b[prop]) {
      return 1;
    }
    return 0;
  });

  return myData;
};

export const sortGeos = (data, prop) => {
  var myData = data.sort((a, b) => {
    if (b[prop] === "other" || a[prop] < b[prop]) return -1;
    if (a[prop] === "other" || a[prop] > b[prop]) return 1;
    return 0;
  });

  return myData;
};

