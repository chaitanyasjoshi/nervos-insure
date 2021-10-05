require('dotenv').config();
require('babel-register');
require('babel-polyfill');
const { PolyjuiceHDWalletProvider } = require('@polyjuice-provider/truffle');
const { PolyjuiceHttpProvider } = require('@polyjuice-provider/web3');

const rpc_url = new URL('http://godwoken-testnet-web3-rpc.ckbapp.dev');

const godwoken_rpc_url = 'http://godwoken-testnet-web3-rpc.ckbapp.dev';
const polyjuice_config = {
  rollupTypeHash:
    '0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a',
  ethAccountLockCodeHash:
    '0xdeec13a7b8e100579541384ccaf4b5223733e4a5483c3aec95ddc4c1d5ea5b22',
  web3Url: godwoken_rpc_url,
};

const polyjuiceHttpProvider = new PolyjuiceHttpProvider(
  polyjuice_config.web3Url,
  polyjuice_config
);
const polyjuiceTruffleProvider = new PolyjuiceHDWalletProvider(
  [
    {
      privateKeys: [process.env.PRIVATE_KEY],
      providerOrUrl: polyjuiceHttpProvider,
    },
  ],
  polyjuice_config
);

module.exports = {
  networks: {
    development: {
      host: rpc_url.hostname, // Localhost (default: none)
      port: rpc_url.port, // Standard Ethereum port (default: none)
      gasPrice: '0', // important for dryRun mode. 0 must be string type.
      network_id: '*', // Any network (default: none)
      provider: () => polyjuiceTruffleProvider,
    },
  },
  contracts_directory: './contracts',
  contracts_build_directory: './client/web3/artifacts',
  compilers: {
    solc: {
      version: '0.8.7',
      // optimizer: {
      //   enabled: true,
      //   runs: 200,
      // },
    },
  },
};
