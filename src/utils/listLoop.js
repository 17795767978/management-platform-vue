export function arrLoop (oldArr, newArr) {
  oldArr.forEach((list, index) => {
    if (list !== null && typeof list === 'object') {
      newArr.forEach((obj, key) => {
        if (index === key) {
          newArr[key].mediaSize = Math.round(oldArr[index].size / 1024 / 1024);
          newArr[key].title = oldArr[index].name;
        }
      });
    } else {
      newArr.forEach((obj, key) => {
        if (index === key) {
          newArr[key].mediaUrl = oldArr[index];
        }
      });
    }
  });
  console.log(newArr);
}
