const InsuranceProvider = artifacts.require('InsuranceProvider');

module.exports = async (deployer) => {
  deployer.deploy(InsuranceProvider);
};
