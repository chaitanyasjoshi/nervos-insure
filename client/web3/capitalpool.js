import { AddressTranslator } from 'nervos-godwoken-integration';

import { getInstance } from './getInstance';
import Pool from './artifacts/Pool.json';

const addressTranslator = new AddressTranslator({
  RPC_URL: 'http://localhost:8024',
  eth_account_lock_script_type_hash:
    '0x2cf55023e2bfdbb86e0d95320f7d2f15393a76a830d5bb5e687e0c780d90134d',
  rollup_type_hash:
    '0x4b9d74d74843f2f9e74ccf76b56cc6f576ca9b20df6cecaacf906eea5fc5cc52',
});

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
