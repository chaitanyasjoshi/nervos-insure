export const toCkb = function (shannon) {
  return shannon / 10 ** 8;
};

export const fromCkb = function (ckb) {
  const precision = 10 ** 8;
  const preciseCkb = parseFloat(parseFloat(ckb).toFixed(7));
  return precision * preciseCkb;
};
