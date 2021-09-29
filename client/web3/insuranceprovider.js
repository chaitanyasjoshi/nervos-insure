import { getInstance } from './getInstance';
import InsuranceProvider from './artifacts/InsuranceProvider.json';

export const newContract = async function (
  client,
  duration,
  premium,
  payoutValue
) {
  const insuranceProvider = await getInstance(InsuranceProvider);
  const contractAddr = await insuranceProvider.methods
    .newContract(client, duration, premium, payoutValue)
    .send({ value: payoutValue });

  return contractAddr;
};

export const getClientContracts = async function (clientAddr) {
  const insuranceProvider = await getInstance(InsuranceProvider);
  const clientContracts = await insuranceProvider.methods
    .getClientContracts()
    .call({ from: clientAddr });

  return clientContracts;
};

export const getContractCurrentValue = async function (contractAddr) {
  const insuranceProvider = await getInstance(InsuranceProvider);
  const currentValue = await insuranceProvider.methods
    .getContractCurrentValue(contractAddr)
    .call();

  return currentValue;
};

export const getContractRequestCount = async function (contractAddr) {
  const insuranceProvider = await getInstance(InsuranceProvider);
  const requestCount = await insuranceProvider.methods
    .getContractRequestCount(contractAddr)
    .call();

  return requestCount;
};

export const getInsurer = async function () {
  const insuranceProvider = await getInstance(InsuranceProvider);
  const insurer = await insuranceProvider.methods.getInsurer().call();

  return insurer;
};

export const getContractStatus = async function (contractAddr) {
  const insuranceProvider = await getInstance(InsuranceProvider);
  const status = await insuranceProvider.methods
    .getContractStatus(contractAddr)
    .call();

  return status;
};

export const getContractBalance = async function () {
  const insuranceProvider = await getInstance(InsuranceProvider);
  const balance = await insuranceProvider.methods.getContractBalance().call();

  return balance;
};
