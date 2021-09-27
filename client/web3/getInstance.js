import { getWeb3 } from './getWeb3';

export const getInstance = async function (artifact, contractAddr) {
  // Network ID, address and abi
  const web3 = await getWeb3();
  const networkId = await web3.eth.net.getId();
  const networkData = artifact.networks[networkId];
  if (networkData) {
    const contractInstance = new web3.eth.Contract(
      contractAddr || artifact.abi,
      networkData.address
    );

    return contractInstance;
  } else {
    console.error('Contract not deployed to detected network');
  }
};
