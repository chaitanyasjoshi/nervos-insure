import { AddressTranslator } from 'nervos-godwoken-integration';

import { getInstance } from './getInstance';
import Pool from './artifacts/Pool.json';

const addressTranslator = new AddressTranslator();

export const deposit = async function (amount, clientAddr) {
  const pool = await getInstance(Pool);
  await pool.methods.deposit().send({
    value: amount,
    from: clientAddr,
  });
};

export const withdraw = async function (amount, clientAddr) {
  const pool = await getInstance(Pool);
  await pool.methods.withdraw(amount).send({
    from: clientAddr,
  });
};

export const getReserveAvailableLiquidity = async function () {
  const pool = await getInstance(Pool);
  const liquidity = await pool.methods.getReserveAvailableLiquidity().call();

  return liquidity;
};

export const balanceOf = async function (clientAddr) {
  const pool = await getInstance(Pool);
  const balance = await pool.methods
    .balanceOf(addressTranslator.ethAddressToGodwokenShortAddress(clientAddr))
    .call();

  return balance;
};

export const getWithdrawalUnlockDate = async function (clientAddr) {
  const pool = await getInstance(Pool);
  const unlockDate = await pool.methods
    .getWithdrawalUnlockDate(
      addressTranslator.ethAddressToGodwokenShortAddress(clientAddr)
    )
    .call();

  return unlockDate;
};
