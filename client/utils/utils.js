import BigNumber from 'bignumber.js';

const DECIMALS = 8;

export const fromShannon = function (shannon) {
  const bn = new BigNumber(shannon + 'e-' + DECIMALS);
  return bn.toString();
};

export const toShannon = function (ckb) {
  const bn = new BigNumber(ckb + 'e+' + DECIMALS);
  return bn.toString();
};
