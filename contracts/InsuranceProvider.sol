// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./InsuranceContract.sol";
import "./Pool.sol";

contract InsuranceProvider is Ownable {
  using SafeMath for uint;
  using Counters for Counters.Counter;
  
  AggregatorV3Interface internal priceFeed;
  Pool private capitalPool;
  
  uint public constant DAY_IN_SECONDS = 60; //Seconds in a day. 60 for testing, 86400 for Production
  
  Counters.Counter private _contractCount;
  address[] contracts;

  mapping(address => address[]) clientContract;

  constructor() {
    priceFeed = AggregatorV3Interface(0x0FcBAebA1BD0EbF3cFed672C3e98B4aa76DA9546);
  }
    
  event contractCreated(address _insuranceContract, uint _premium, uint _totalCover);
    
  function newContract(uint _duration, uint _premium, uint _payoutValue) public payable returns(address) {
    require(_duration.mod(DAY_IN_SECONDS.mul(30)) == 0, 'Cover duration must be in muliple of 30 days');
    require(_payoutValue >= 0, 'Payout value must be greater than 0');
    require(_premium > 0, 'Premium must be greater than 0');
    require(msg.value == _premium, 'Premium must be paid at the time of contract creation');
        
    uint _collateralValue = uint(getLatestPrice()); //Calculate collateral value based on current price;
        
    address contractAddr = address(new InsuranceContract(payable(msg.sender), _duration, _premium, _payoutValue, _collateralValue));

    _contractCount.increment();
    contracts.push(contractAddr);
    clientContract[msg.sender].push(contractAddr);

    emit contractCreated(contractAddr, msg.value, _payoutValue);

    return contractAddr;
  }

  function setCapitalPool(address _pool) external onlyOwner {
    capitalPool = Pool(_pool);
  }

  function getCapitalPool() external view returns (Pool) {
    return capitalPool;
  }
    
  function getClientContracts(address _client) external view returns (address[] memory) {
    return clientContract[_client];
  }

  function getContractCount() external view returns(Counters.Counter memory) {
    return _contractCount;
  }

  function getTotalContractValue() external view returns(uint) {
    uint totalContractValue = 0;
    for (uint256 i = 0; i < contracts.length; i++) {
      InsuranceContract insuranceContract = InsuranceContract(contracts[i]);
      totalContractValue = totalContractValue.add(insuranceContract.getPayoutValue());
    }

    return totalContractValue;
  }

  function getActiveContractCount() external view returns(uint) {
    uint activeContractCount = 0;
    for (uint256 i = 0; i < contracts.length; i++) {
      InsuranceContract insuranceContract = InsuranceContract(contracts[i]);
      bool isActive = insuranceContract.getContractStatus();

      if(isActive) {
        activeContractCount = activeContractCount.add(1);
      }
    }

    return activeContractCount;
  }

  function updateContract(address _contract) external {
    InsuranceContract insuranceContract = InsuranceContract(_contract);
    insuranceContract.updateContract();
  }

  function getContractCurrentValue(address _contract) external view returns(uint) {
    InsuranceContract insuranceContract = InsuranceContract(_contract);
    return insuranceContract.getCurrentValue();
  }

  function getContractRequestCount(address _contract) external view returns(uint) {
    InsuranceContract insuranceContract = InsuranceContract(_contract);
    return insuranceContract.getRequestCount();
  }

  function getInsurer() external view returns (address) {
    return address(this);
  }

  function getContractStatus(address _contract) external view returns (bool) {
    InsuranceContract insuranceContract = InsuranceContract(_contract);
    return insuranceContract.getContractStatus();
  }

  function endContractProvider() external onlyOwner() {
    selfdestruct(payable(owner()));
  }

  function getLatestPrice() internal view returns (int) {
    (
      uint80 roundID,
      int price,
      uint startedAt,
      uint timeStamp,
      uint80 answeredInRound
    ) = priceFeed.latestRoundData();
    require(timeStamp > 0, "Round not complete");

    return price;
  }
}