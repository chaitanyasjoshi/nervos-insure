// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./InsuranceProvider.sol";

contract Pool is ReentrancyGuard {
  InsuranceProvider private insuranceProvider;

  uint public constant DAY_IN_SECONDS = 60; //Seconds in a day. 60 for testing, 86400 for Production
  uint public constant LOCKIN_PERIOD = 2;  // Cooldown period for withdrawals

  struct Details {
    uint depositStart;
    uint balance;
  }

  mapping (address => Details) capitalProviders;

  modifier onlyAmountGreaterThanZero(uint256 _amount) {
    require(_amount > 0, "Amount must be greater than 0");
    _;
  }

  modifier availableForWithdrawal(address _client) {
    Details memory providerDetails = capitalProviders[_client];
    require(
      providerDetails.depositStart + (DAY_IN_SECONDS * LOCKIN_PERIOD) >= block.timestamp, 
      "Cannot withdraw during lock period"
    );
    _;
  }

  modifier hasSufficientBalance(address _client, uint _amount) {
    Details memory providerDetails = capitalProviders[_client];
    require(providerDetails.balance >= _amount, "Insufficient balance");
    _;
  }

  modifier onlyClientContract(address _client, address _contract) {
    address[] memory clientContracts = insuranceProvider.getClientContracts(_client);
    bool isClientContract = false;
    for (uint i = 0; i < clientContracts.length; i++) {
      if(clientContracts[i] == _contract) {
        isClientContract = true;
      }
    }

    require(isClientContract == true, "Only client contracts can call this function");
    _;
  }

  modifier onlyActiveContract(address _contract) {
    bool isActive = insuranceProvider.getContractStatus(_contract);
    require(isActive == true, "Inactive contract");
    _;
  }

  event Deposit(address indexed _client, uint _amount, uint _timeStart);
  event Withdraw(address indexed _client, uint _amount, uint _time);
  event Claim(address indexed _client, uint _payoutValue, uint _time);

  constructor(address _insuranceProvider) {
    insuranceProvider = InsuranceProvider(_insuranceProvider);
  }

  function deposit() 
    external 
    payable 
    nonReentrant 
    onlyAmountGreaterThanZero(msg.value) 
  {
    Details memory providerDetails = capitalProviders[msg.sender];
    uint _depositStart = block.timestamp;
    uint _balance = providerDetails.balance + msg.value;

    capitalProviders[msg.sender] = Details(_depositStart, _balance);
    
    emit Deposit(msg.sender, msg.value, _depositStart);
  }

  function withdraw(uint _amount) 
    external 
    nonReentrant 
    onlyAmountGreaterThanZero(_amount) 
    availableForWithdrawal(msg.sender)
    hasSufficientBalance(msg.sender, _amount)
  {
    uint currentAvailableLiquidity = getReserveAvailableLiquidity();
    require(
      currentAvailableLiquidity >= _amount,
      "There is not enough liquidity available to redeem"
    );

    Details memory providerDetails = capitalProviders[msg.sender];
    uint _updatedBalance = providerDetails.balance - _amount;

    if(_updatedBalance == 0) {
      capitalProviders[msg.sender].depositStart = 0;
    }
    capitalProviders[msg.sender].balance = _updatedBalance;

    (bool success, ) = msg.sender.call{value: _amount}("");
    require(success, "CKB transfer failed.");

    emit Withdraw(msg.sender, _amount, block.timestamp);
  }

  function claimContract(address payable _client, uint _payoutValue) 
    external 
    nonReentrant
    onlyClientContract(_client, msg.sender) 
    onlyActiveContract(msg.sender) 
  {
    (bool success, ) = _client.call{value: _payoutValue}("");
    require(success, "CKB transfer failed.");

    emit Claim(_client, _payoutValue, block.timestamp);
  }

  function getReserveAvailableLiquidity() public view returns (uint) {
    return address(this).balance;
  }

  /** 
  * @notice Explain to an end user what this does
  * @dev Explain to a developer any extra details
  * @param _client polyjuice address of client
  * @return balance of deposited funds of client
  **/
  function balanceOf(address _client) external view returns (uint) {
    Details memory providerDetails = capitalProviders[_client];

    return providerDetails.balance;
  }

  /** 
  * @notice Explain to an end user what this does
  * @dev Explain to a developer any extra details
  * @param _client polyjuice address of client
  * @return fund unlock date off client
  **/
  function getWithdrawalUnlockDate(address _client) public view returns (uint) {
    Details memory providerDetails = capitalProviders[_client];

    return providerDetails.depositStart + DAY_IN_SECONDS * LOCKIN_PERIOD;
  }
}
