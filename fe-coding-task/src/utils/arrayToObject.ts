export const convertArrayToObject = (array: Array<any>, key: string) => {
  return array.reduce((obj, item) => {
    obj[item[key]] = item;
    return obj;
  }, {});
};
