// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract InsuranceContract is Ownable {
  using SafeMath for uint;
  AggregatorV3Interface internal priceFeed;

  uint public constant DAY_IN_SECONDS = 60; //Seconds in a day. 60 for testing, 86400 for Production

  address public insurer;
  address client;
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
    if (startDate + duration < block.timestamp) {
      _;
    }
  }

  modifier onContractActive() {
    require(contractActive == true ,'Contract has ended, cant interact with it anymore');
    _;
  }

  modifier callFrequencyOncePerDay() {
    require(block.timestamp.sub(currentValueDateChecked) > (DAY_IN_SECONDS.sub(DAY_IN_SECONDS.div(12))),'Can only check token value once per day');
    _;
  }
    
  event contractCreated(address _insurer, address _client, uint _duration, uint _premium, uint _totalCover);
  event contractPaidOut(uint _paidTime, uint _totalPaid, uint _finalCollateralValue);
  event contractEnded(uint _endTime, uint _totalReturned);
    
  constructor(address _client, uint _duration, uint _premium, uint _payoutValue, uint _collateralValue) {
    priceFeed = AggregatorV3Interface(0x0FcBAebA1BD0EbF3cFed672C3e98B4aa76DA9546);
        
    insurer = msg.sender;
    client = _client;
    startDate = block.timestamp;
    duration = _duration;
    premium = _premium;
    payoutValue = _payoutValue;
    contractActive = true;
    collateralValue = _collateralValue;
        
    emit contractCreated(insurer, client, duration, premium, payoutValue);
  }
    
  function updateContract() public onContractActive() onlyOwner() {
    checkEndContract();

    if (contractActive) {
      currentValue = uint(getLatestPrice());
      currentValueDateChecked = block.timestamp;
      requestCount += 1;
      if(currentValue <= (collateralValue.mul(10)).div(100)) {
        payOutContract();
      }
    }
        
  }
    
  function payOutContract() private onContractActive() {
    payable(client).transfer(premium);
    payable(insurer).transfer(address(this).balance);

    emit contractPaidOut(block.timestamp, payoutValue, currentValue);

    contractActive = false;
    contractPaid = true;
        
  }
    
  function checkEndContract() private onContractEnded() {
    if (requestCount >= (duration.div(DAY_IN_SECONDS) - 2)) {
      payable(insurer).transfer(address(this).balance);
    } else {
      //Insurer did not make required no of requests
      payable(client).transfer(premium);
      payable(insurer).transfer(address(this).balance);
      contractPaid = true;
    }

    contractActive = false;
    emit contractEnded(block.timestamp, address(this).balance);
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