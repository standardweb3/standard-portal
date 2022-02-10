export function zeroPad(num, padLen) {
  var n = Math.abs(num);
  var zeros = Math.max(0, padLen - Math.floor(n).toString().length);
  var zeroString = Math.pow(10, zeros)
    .toString()
    .substr(1);
  if (num < 0) {
    zeroString = '-' + zeroString;
  }

  return zeroString + n;
}
