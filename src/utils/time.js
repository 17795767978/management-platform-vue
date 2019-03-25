export function timeTo (time) {
  let t;
  if (time > -1) {
    console.log(time);
    let hour = Math.floor(time / 3600);
    let min = Math.floor(time / 60) % 60;
    let sec = time % 60;
    if (hour < 10) {
      t = '0' + hour + ':';
    } else {
      t = hour + ':';
    }

    if (min < 10) {
      t += '0';
    }
    t += min + ':';
    if (sec < 10) {
      t += '0';
    }
    t += sec.toFixed(0);
  }
  return t;
}
