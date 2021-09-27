require('dotenv').config();
require('babel-register');
require('babel-polyfill');
const { PolyjuiceHDWalletProvider } = require('@polyjuice-provider/truffle');
const { PolyjuiceHttpProvider } = require('@polyjuice-provider/web3');

const rpc_url = new URL('http://localhost:8024');

const godwoken_rpc_url = 'http://localhost:8024';
const polyjuice_config = {
  rollupTypeHash:
    '0x4b9d74d74843f2f9e74ccf76b56cc6f576ca9b20df6cecaacf906eea5fc5cc52',
  ethAccountLockCodeHash:
    '0x2cf55023e2bfdbb86e0d95320f7d2f15393a76a830d5bb5e687e0c780d90134d',
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
