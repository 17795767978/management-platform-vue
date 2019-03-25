export function checkNumber (num) {
  const isNumber = /^[0-9]+$/.test(num);
  const isLimitLength = num.length < 10;
  return new Promise((resolve, reject) => {
    if (isNumber && isLimitLength) {
      resolve();
    }
    if (!isNumber) {
      reject('请输入数字');
    }
    if (isNumber && !isLimitLength) {
      reject('修改数字不能超过9位数');
    }
  });
}
