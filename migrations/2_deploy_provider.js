const InsuranceProvider = artifacts.require('InsuranceProvider');
const Pool = artifacts.require('Pool');

module.exports = async (deployer) => {
  await deployer.deploy(InsuranceProvider);
  const insuranceProvider = await InsuranceProvider.deployed();
  await deployer.deploy(Pool, insuranceProvider.address);
  const pool = await Pool.deployed();
  await insuranceProvider.setCapitalPool(pool.address);
};
