export function uniq (array) {
  let temp = []; // 一个新的临时数组
  for (let i = 0; i < array.length; i++) {
    if (temp.indexOf(array[i]) === -1) {
      temp.push(array[i]);
    }
  }
  return temp;
}
