export const toCkb = function (shannon) {
  return shannon / 10 ** 8;
};

export const fromCkb = function (ckb) {
  console.log(parseFloat(ckb).toFixed(8) * 10 ** 8);
  return parseFloat(ckb).toFixed(8) * 10 ** 8;
};
