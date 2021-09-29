import { getInstance } from './getInstance';
import InsuranceContract from './artifacts/InsuranceContract.json';

export const getContractBalance = async function (contractAddr) {
  const insuranceContract = await getInstance(InsuranceContract, contractAddr);
  const balance = await insuranceContract.methods.getContractBalance().call();

  return balance;
};

export const getPayoutValue = async function (contractAddr) {
  const insuranceContract = await getInstance(InsuranceContract, contractAddr);
  const payoutValue = await insuranceContract.methods.getPayoutValue().call();

  return payoutValue;
};

export const getPremium = async function (contractAddr) {
  const insuranceContract = await getInstance(InsuranceContract, contractAddr);
  const premium = await insuranceContract.methods.getPremium().call();

  return premium;
};

export const getContractStatus = async function (contractAddr) {
  const insuranceContract = await getInstance(InsuranceContract, contractAddr);
  const status = await insuranceContract.methods.getContractStatus().call();

  return status;
};

export const getContractPaid = async function (contractAddr) {
  const insuranceContract = await getInstance(InsuranceContract, contractAddr);
  const isPaid = await insuranceContract.methods.getContractPaid().call();

  return isPaid;
};

export const getCurrentValue = async function (contractAddr) {
  const insuranceContract = await getInstance(InsuranceContract, contractAddr);
  const currentValue = await insuranceContract.methods.getCurrentValue().call();

  return currentValue;
};

export const getRequestCount = async function (contractAddr) {
  const insuranceContract = await getInstance(InsuranceContract, contractAddr);
  const requestCount = await insuranceContract.methods.getRequestCount().call();

  return requestCount;
};

export const getCurrentValueDateChecked = async function (contractAddr) {
  const insuranceContract = await getInstance(InsuranceContract, contractAddr);
  const dateChecked = await insuranceContract.methods
    .getCurrentValueDateChecked()
    .call();

  return dateChecked;
};

export const getDuration = async function (contractAddr) {
  const insuranceContract = await getInstance(InsuranceContract, contractAddr);
  const duration = await insuranceContract.methods.getDuration().call();

  return duration;
};

export const getContractStartDate = async function (contractAddr) {
  const insuranceContract = await getInstance(InsuranceContract, contractAddr);
  const startDate = await insuranceContract.methods
    .getContractStartDate()
    .call();

  return startDate;
};
