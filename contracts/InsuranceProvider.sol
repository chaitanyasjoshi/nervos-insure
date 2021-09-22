// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./InsuranceContract.sol";

contract InsuranceProvider is Ownable {
    using SafeMath for uint;
    
    address public insurer;
    AggregatorV3Interface internal priceFeed;
    
    uint public constant DAY_IN_SECONDS = 60; //Seconds in a day. 60 for testing, 86400 for Production
    
    mapping(address => InsuranceContract) contracts;
    mapping(address => address) clientToContract;

    constructor() {
        insurer = payable(msg.sender);
        priceFeed = AggregatorV3Interface(0x0FcBAebA1BD0EbF3cFed672C3e98B4aa76DA9546);
    }
    
    event contractCreated(address _insuranceContract, uint _premium, uint _totalCover);
    
    function newContract(address _client, uint _duration, uint _premium, uint _payoutValue) public payable onlyOwner() returns(address) {
        // require(_duration >= DAY_IN_SECONDS * 30, 'Cover duration must be atleast 30 days');
        // require(_payoutValue >= 0, 'Payout value must be greater than 0');
        // require(_premium > 0, 'Premium must be greater than 0');
        // require(msg.value == _premium, 'Premium must be paid at the time of contract creation');
        
        uint _collateralValue = uint(getLatestPrice()); //Calculate collateral value based on current price;
        
        address contractAddr = address((new InsuranceContract){value: _payoutValue}(_client, _duration, _premium, _payoutValue, _collateralValue));

        InsuranceContract insuranceContract = InsuranceContract(contractAddr);
        contracts[contractAddr] = insuranceContract;
        clientToContract[msg.sender] = contractAddr;

        emit contractCreated(address(insuranceContract), msg.value, _payoutValue);

        return address(insuranceContract);
    }
    
    function getContract(address _contract) external view returns (InsuranceContract) {
        return contracts[_contract];
    }
    
    function getClientContract(address _client) external view returns (InsuranceContract) {
        address contractAddr = clientToContract[_client];
        return contracts[contractAddr];
    }

    function updateContract(address _contract) external {
        InsuranceContract i = InsuranceContract(_contract);
        i.updateContract();
    }

    function getContractCurrentValue(address _contract) external view returns(uint) {
        InsuranceContract i = InsuranceContract(_contract);
        return i.getCurrentValue();
    }

    function getContractRequestCount(address _contract) external view returns(uint) {
        InsuranceContract i = InsuranceContract(_contract);
        return i.getRequestCount();
    }

    function getInsurer() external view returns (address) {
        return insurer;
    }

    function getContractStatus(address _address) external view returns (bool) {
        InsuranceContract i = InsuranceContract(_address);
        return i.getContractStatus();
    }

    function getContractBalance() external view returns (uint) {
        return address(this).balance;
    }

    function endContractProvider() external onlyOwner() {
        selfdestruct(payable(insurer));
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