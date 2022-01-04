export function reverseArray(arr) {
  let brandNewArray = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    brandNewArray.push(arr[i]);
  }
  return brandNewArray;
}
