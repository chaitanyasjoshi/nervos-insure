export const toCkb = function (shannon) {
  return shannon / 10 ** 8;
};

export const fromCkb = function (ckb) {
  return ckb * 10 ** 8;
};
