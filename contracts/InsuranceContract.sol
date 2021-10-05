// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/interfaces/FeedRegistryInterface.sol";
import "./Denominations.sol";
import "./InsuranceProvider.sol";
import "./Pool.sol";

contract InsuranceContract is Ownable {
  using SafeMath for uint;
  FeedRegistryInterface internal registry;

  uint public constant DAY_IN_SECONDS = 60; //Seconds in a day. 60 for testing, 86400 for Production

  InsuranceProvider public insurer;
  address payable client;
  uint startDate;
  uint duration;
  uint premium;
  uint payoutValue;
  uint collateralValue;
    
  bool contractActive;
  bool contractPaid = false;
  uint currentValue = 0;
  uint currentValueDateChecked = block.timestamp;
  uint requestCount = 0;

  modifier onContractEnded() {
    if (startDate.add(duration) < block.timestamp) {
      _;
    }
  }

  modifier onContractActive() {
    require(contractActive == true ,'Contract has ended, cant interact with it anymore');
    _;
  }

  modifier callFrequencyOncePerDay() {
    require(
      block.timestamp.sub(currentValueDateChecked) > (DAY_IN_SECONDS.sub(DAY_IN_SECONDS.div(12))),
      'Can only check token value once per day'
    );
    _;
  }
    
  event contractCreated(address indexed _client, address _insurer, uint _duration, uint _premium, uint _totalCover);
  event contractPaidOut(address indexed _client, uint _paidTime, uint _totalPaid, uint _finalCollateralValue);
  event contractEnded(address indexed _client, uint _endTime);
    
  constructor(
    address payable _client, 
    uint _duration, 
    uint _premium, 
    uint _payoutValue, 
    uint _collateralValue) 
  {
    registry = FeedRegistryInterface(0x1363bdCE312532F864e84924D54c7dA5eDB5B1BC);
        
    insurer = InsuranceProvider(msg.sender);
    client = _client;
    startDate = block.timestamp;
    duration = _duration;
    premium = _premium;
    payoutValue = _payoutValue;
    contractActive = true;
    collateralValue = _collateralValue;
        
    emit contractCreated(client, address(insurer), duration, premium, payoutValue);
  }
    
  function updateContract() 
    public 
    onContractActive 
    onlyOwner 
    callFrequencyOncePerDay 
  {
    checkEndContract();

    if (contractActive) {
      currentValue = uint(getLatestPrice());
      currentValueDateChecked = block.timestamp;
      requestCount = requestCount.add(1);
      if(currentValue <= (collateralValue.mul(10)).div(100)) {
        payOutContract();
      }
    }
  }
    
  function payOutContract() private onContractActive {
    Pool capitalPool = insurer.getCapitalPool();
    capitalPool.claimContract(client, payoutValue);

    emit contractPaidOut(client, block.timestamp, payoutValue, currentValue);

    contractActive = false;
    contractPaid = true;
  }
    
  function checkEndContract() private onContractEnded {
    if (!(requestCount >= (duration.div(DAY_IN_SECONDS) - 2))) {
      Pool capitalPool = insurer.getCapitalPool();
      capitalPool.claimContract(client, payoutValue);
    }

    contractActive = false;
    emit contractEnded(client, block.timestamp);
  }
    
  function getLatestPrice() internal view returns (int) {
    (
      uint80 roundID, 
      int price,
      uint startedAt,
      uint timeStamp,
      uint80 answeredInRound
    ) = registry.latestRoundData(Denominations.ETH, Denominations.USD);
    require(timeStamp > 0, "Round not complete");
        
    return price;
  }

  function getClient() external view returns (address) {
    return client;
  }
    
  function getPayoutValue() external view returns (uint) {
    return payoutValue;
  }

  function getPremium() external view returns (uint) {
    return premium;
  }

  function getContractStatus() external view returns (bool) {
    return contractActive;
  }

  function getContractPaid() external view returns (bool) {
    return contractPaid;
  }
    
  function getCurrentValue() external view returns (uint) {
    return currentValue;
  }

  function getRequestCount() external view returns (uint) {
    return requestCount;
  }

  function getCurrentValueDateChecked() external view returns (uint) {
    return currentValueDateChecked;
  }

  function getDuration() external view returns (uint) {
    return duration;
  }

  function getContractStartDate() external view returns (uint) {
    return startDate;
  }
}