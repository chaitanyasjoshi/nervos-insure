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
    .newContract(duration, premium, payoutValue)
    .send({ value: premium, from: client });

  return contractAddr;
};

export const getClientContracts = async function (clientAddr) {
  const insuranceProvider = await getInstance(InsuranceProvider);
  const clientContracts = await insuranceProvider.methods
    .getClientContracts(clientAddr)
    .call({ from: clientAddr });

  return clientContracts;
};

export const getContractCount = async function () {
  const insuranceProvider = await getInstance(InsuranceProvider);
  const contractCount = await insuranceProvider.methods
    .getContractCount()
    .call();

  return contractCount;
};

export const getTotalContractValue = async function () {
  const insuranceProvider = await getInstance(InsuranceProvider);
  const contractValue = await insuranceProvider.methods
    .getTotalContractValue()
    .call();

  return contractValue;
};

export const getActiveContractCount = async function () {
  const insuranceProvider = await getInstance(InsuranceProvider);
  const activeContractCount = await insuranceProvider.methods
    .getActiveContractCount()
    .call();

  return activeContractCount;
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
