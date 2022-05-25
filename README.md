# Ethernaught Coding Challenges
## [Donnie Misino](https://www.linkedin.com/in/dmisino/), 5/24/2022

The [Ethernaught Solidity Challenges](https://ethernaut.openzeppelin.com/) are a set of 26 security related problems published by OpenZeppelin. These challenges start off fairly simple, then become progressively more difficult. This project contains my solutions to those problems. 

In each case you are required to compromise a solidity smart contract, such as taking ownership, draining funds, or breaking the functionality of the target contract. In many cases this requires deploying a smart contract to attack the target contract. In others the challenge must be solved with web3 commands issued via console or code. 

In doing these exercises I made a sincere attempt to solve them without referring to any online material other than official documentation, such as the [Official Solidity Docs](https://docs.soliditylang.org/en/latest/), [web3.eth Documentation](https://web3js.readthedocs.io), or [Chrome Developer Tools](https://developer.chrome.com/docs/devtools/). For anyone wanting to learn the lessons provided by these challenges, I would suggest not reading any further until you have first spent some time trying to solve them the same way.  

---
## Ethernaught 01: [Fallback](https://ethernaut.openzeppelin.com/level/0x9CB391dbcD447E645D6Cb55dE6ca23164130D008)

**Challenge**: Take ownership of the contract

**Technique**: Invoke the ```receive()``` fallback function

**Solution**: Logic in the payable fallback function sets the caller as the owner as long as they have made a prior contribution. Make a contribution, then invoke the ```receive()``` implementation by sending some ETH to the contract via the ```call()``` method.

Challenge contract: [contracts/Fallback.sol](contracts/Fallback.sol)  
Solution contract: [contracts/Fallback_Hack.sol](contracts/Fallback_Hack.sol)  
Test: [test/E01_Fallback.test.js](test/E01_Fallback.test.js)

---
## Ethernaught 02: [Fallout](https://ethernaut.openzeppelin.com/level/0x5732B2F88cbd19B6f01E3a96e9f0D90B917281E5)

**Challenge**: Take ownership of the contract

**Exploit**: Misnamed constructor

**Solution**: A misnamed constructor makes it like any regular public function. This applies to versions of solidity prior to [v0.5.0](https://docs.soliditylang.org/en/latest/050-breaking-changes.html#constructors), where a function with the same name as the contract served as a constructor declaration. Call the misnamed "constructor" while sending any amount of ETH to take ownership of the contract.

Challenge contract: [contracts/Fallout.sol](contracts/Fallout.sol)  
Solution contract: [contracts/Fallout_Hack.sol](contracts/Fallout_Hack.sol)  
Test: [test/E02_Fallout.test.js](test/E02_Fallout.test.js)

---
## Ethernaught 03: [Coin Flip](https://ethernaut.openzeppelin.com/level/0x4dF32584890A0026e56f7535d0f2C6486753624f)

**Challenge**: The challenge contract simulates a coin flip. Correctly guess the outcome 10 times in a row.

**Exploit**: Frontrunning a predictable outcome

**Solution**: The logic for determining the result of each coin flip is not random, and can be reproduced to predict the outcome. Create a hack contract that copies the logic in the CoinFlip contract to get the outcome just prior to calling the ```flip()``` function.

Source contract: [contracts/CoinFlip.sol](contracts/CoinFlip.sol)  
Solution contract: [contracts/CoinFlip_Hack.sol](contracts/CoinFlip_Hack.sol)  
Test: [test/E03_CoinFlip.test.js](test/E03_CoinFlip.test.js)

---
## Ethernaught 04: [Telephone](https://ethernaut.openzeppelin.com/level/0x0b6F6CE4BCfB70525A31454292017F640C10c768)

**Challenge**: Take ownership of the contract

**Exploit**:  Understanding ```tx.origin``` vs. ```msg.sender```

**Solution**: The codes logic assigns ownership to anyone calling the ```changeOwner()``` function, as long as ```tx.origin != msg.sender```. Create a hack contract that calls the ```changeOwner()``` function. The contract address will be ```msg.sender```, and the user address calling the hack contract which in turn calls the target contract will be ```tx.origin```.

Challenge contract: [contracts/Telephone.sol](contracts/Telephone.sol)  
Solution contract: [contracts/Telephone_Hack.sol](contracts/Telephone_Hack.sol)  
Test: [test/E04_Telephone.test.js](test/E04_Telephone.test.js)

---
## Ethernaught 05: [Token](https://ethernaut.openzeppelin.com/level/0x63bE8347A617476CA461649897238A31835a32CE)

**Challenge**: You are given 20 tokens. Get more to complete the challenge.

**Exploit**: Arithmetic underflow

**Solution**: Call the challenge contract to transfer away 21 tokens, which will cause your balance to underflow, giving you  the ```uint256``` maximum value ```(2**256-1)``` tokens. This applies to solidity versions prior to [v0.8.0](https://docs.soliditylang.org/en/latest/080-breaking-changes.html#silent-changes-of-the-semantics), after which checks were added to the compiler.

Challenge contract: [contracts/Token.sol](contracts/Token.sol)  
Test: [test/E05_Token.test.js](test/E05_Token.test.js)

---
## Ethernaught 06: [Delegation](https://ethernaut.openzeppelin.com/level/0x9451961b7Aea1Df57bc20CC68D72f662241b5493)

**Challenge**: Take ownership of the contract

**Exploit**: Using ```delegatecall()``` to modify contract state

**Solution**: ```Delegation``` fallback function makes a ```delegatecall()``` passing ```msg.data``` to the ```Delegate``` contract, which has a function that changes owner. Since ```delegatecall()``` uses functions from the delegate, but in the memory context of the caller, the storage memory in ```Delegation``` can be changed by the ```Delegate``` contract. ```Owner``` is declared in the first memory slot in both contracts, so changing owner from the ```Delegate``` contract overwrites owner in the ```Delegation``` contracts storage. Invoke the fallback function in ```Delegation```, passing ```msg.data``` that encodes for a function call to the ```pwn()``` function from the ```Delegate``` contract.

Source contract: [contracts/Delegation.sol](contracts/Delegation.sol)  
Test: [test/E06_Delegation.test.js](test/E06_Delegation.test.js)

Note: Currently there appears to be an issue specifically with hardhat that prevents ```delegatecall()``` from working properly. This issue is discussed further [here](https://ethereum.stackexchange.com/questions/114783/solidity-0-8-delegatecall-does-not-mutate-contracts-storage).

To test the approach using console commands, use "Get new instance" on the [Ethernaught Delegation](https://ethernaut.openzeppelin.com/level/0x9451961b7Aea1Df57bc20CC68D72f662241b5493) page, then using the console:

```javascript
// First get the encoded function call you need. For asciiToHex() the second param is 4, which tells the function to convert to a bytes4 value. Result of this call added to "data" parameter in sendTransaction() below.
await web3.utils.asciiToHex(web3.utils.sha3("pwn()"),4); 

// Call the Delegation contract
await sendTransaction({
    from: "<your wallet address>",
    to: "<contract instance address>",
    data:"0xdd365b8b0000000000000000000000000000000000000000000000000000000000000000"
    });
```

---
## Ethernaught 07: [Force](https://ethernaut.openzeppelin.com/level/0x22699e6AdD7159C3C385bf4d7e1C647ddB3a99ea)

**Challenge**: Get the balance of a contract that has no payable functions to be greater than zero

**Exploit**: ```selfdestruct()``` to force ETH into a contract

**Solution**: There are currently 3 ways ETH can get to a contract: 
1. functions marked as ```payable``` 
2. miner rewards 
3. ```selfdestruct(address receiver)```  

If a contract with a balance invokes ```selfdestruct(address receiver)```, its balance will be moved to the specified ```receiver``` address. Create a contract with an ETH balance > 0, then have it use ```selfdestruct()```, passing in the ```Force``` contracts address as ```receiver```.

Source contract: [contracts/Force.sol](contracts/Force.sol)  
Solution contract: [contracts/Force_Hack.sol](contracts/Force_Hack.sol)  
Test: [test/E07_Force.test.js](test/E07_Force.test.js)

---
## Ethernaught 08: [Vault](https://ethernaut.openzeppelin.com/level/0xf94b476063B6379A3c8b6C836efB8B3e10eDe188)

**Challenge**: Unlock the vault by setting public variable ```locked``` to false

**Exploit**: Reading private contract memory

**Solution**: To unlock the contract, we need the value of the ```bytes32 private password``` variable that gets set in the contracts constructor. Memory in an EVM contract is divided into 32 byte slots which are filled starting at index 0, in the order variables are declared. 

```solidity
contract Vault {
  bool public locked;
  bytes32 private password;
  ...
}
```
Multiple variables will be placed within the same memory slot to conserve space if they fit. The first variable declared is a ```bool``` (1 byte) which will be in slot 0, the second is the ```bytes32 private password``` which cannot fit in the remaining 31 bytes of space in slot 0, so it will be placed in slot 1. Using web3 commands we can read contract storage at slot 1. Note, private contract memory cannot be read by other contracts. Only remote commands, such as using web3 (which in turn calls [ethereum RPC commands](https://ethereum.org/en/developers/docs/apis/json-rpc/)), allow us to read storage data declared as private.

```javascript
// 3 different ways to get contract data at a storage location

// Using ethers, as in the accompanying javascript test:
await ethers.provider.getStorageAt('<contract instance address'>, 1);

// Using web3:
await web3.eth.getStorageAt('<contract instance address>', 1);

// Using an ethereum RPC call:
await ethereum.request({method: 'eth_getStorageAt', "params": ["<contract address>", "<hex memory location>", "latest"], "id": 1});
```
Source contract: [contracts/Vault.sol](contracts/Vault.sol)  
Test: [test/E08_Vault.test.js](test/E08_Vault.test.js)

---
## Ethernaught 09: [King](https://ethernaut.openzeppelin.com/level/0x43BA674B4fbb8B157b7441C2187bCdD2cdF84FD5)

**Challenge**: Whoever sends more ETH than the current prize becomes King. The ETH sent to the contract when becoming the new King is sent to the previous King. Prevent anyone from taking King back.

**Exploit**: External call causing a failure in ```address.transfer()```

**Solution**: ```address.transfer()``` functionality is handled by the receiving contract. Create a contract that can send enough ETH to the King contract, so that your contract becomes the new King. When the next person tries to send ETH and become King, the King contract will use ```king.transfer(msg.value)``` to send the ETH it received to your contract, before assigning the new King with ```king = msg.sender```. Include code in the ```receive()``` function to force a failure, which will prevent the operation from being able to successfully complete and assign a new King. 

**Notes**: You must plan carefully when any call will be made that turns execution over to another contract. To avoid doing that when money needs to be transfered to someone, use the [withdraw pattern](https://docs.soliditylang.org/en/v0.8.7/common-patterns.html). Also, having local state variables getting updated after an exteral call has been made is a possible opportunity for a [reentrancy](https://consensys.github.io/smart-contract-best-practices/attacks/reentrancy/) attack. Always update state variables before making any external calls. See the [checks-effects-interactions pattern](https://docs.soliditylang.org/en/develop/security-considerations.html?#use-the-checks-effects-interactions-pattern).

Source contract: [contracts/King.sol](contracts/King.sol)  
Solution contract: [contracts/King_Hack.sol](contracts/King_Hack.sol)  
Test: [test/E09_King.test.js](test/E09_King.test.js)

---
## Ethernaught 10: [Reentrance](https://ethernaut.openzeppelin.com/level/0xe6BA07257a9321e755184FB2F995e0600E78c16D)

**Challenge**: Drain all funds from the contract.

**Exploit**: [Reentrancy](https://consensys.github.io/smart-contract-best-practices/attacks/reentrancy/)

**Solution**: Create a contract that lets you ```donate()``` and ```withdraw()``` on the ```Reentrance``` contract. In the ```receive()``` fallback function, call ```withdraw()``` again. Because the Reentrance contract updates balances only after sending funds, it is possible to call ```withdraw()``` recursively before execution ever proceeds to the point where a balance update happens that would prevent withdrawing more than the users balance. 

Source contract: [contracts/Reentrance.sol](contracts/Reentrance.sol)  
Solution contract: [contracts/Reentrance_Hack.sol](contracts/Reentrance_Hack.sol)  
Test: [test/E10_Reentrance.test.js](test/E10_Reentrance.test.js)

---
## Ethernaught 11: [Elevator](https://ethernaut.openzeppelin.com/level/0xaB4F3F2644060b2D960b0d88F0a42d1D27484687)

**Challenge**: Get to the top floor, indicated by the ```bool public top``` variable being set equal to ```true```.

**Exploit**: Logic manipulation by an external contract

**Solution**: The ```Elevator``` contract makes 2 calls to an external ```Building``` contract (set as ```msg.sender``` by the ```Elevator``` contract) to check if the requested floor is the top floor in the ```goTo(uint _floor)``` function. Exploit that logic to return different values for the 2 calls.

Create the ```Building``` contract. Implement the ```isLastFloor()``` function so that it first returns ```false``` when someone calls ```goTo(uint _floor)```, and then returns ```true``` on the second call, which is the value it uses to update the ```bool public top``` variable.

Source contract: [contracts/Elevator.sol](contracts/Elevator.sol)  
Solution contract: [contracts/Elevator_Hack.sol](contracts/Elevator_Hack.sol)  
Test: [test/E11_Elevator.test.js](test/E11_Elevator.test.js)

---
## Ethernaught 12: [Privacy](https://ethernaut.openzeppelin.com/level/0x11343d543778213221516D004ED82C45C3c8788B)

**Challenge**: "Unlock" the contract so that ```public bool locked``` gets set to ```false```.

**Exploit**: Reading private contract memory

**Solution**: This contract declares a number of variables, so the first task is to figure out which storage slot contains the data needed to successfully call the ```unlock()``` function:

```solidity
bool public locked = true;
uint256 public ID = block.timestamp;
uint8 private flattening = 10;
uint8 private denomination = 255;
uint16 private awkwardness = uint16(now);
bytes32[3] private data;
```
The value needed is in ```data[2]```, which will be in the last slot (index 5):

```javascript
/* Space used by variable types:
bool = 1  
string = 32  
address = 20  
uint8/int8 = 1  
uint16/int16 = 2  
...  
uint256/int256 = 32  
*/

// Memory slot 0:
bool public locked = true; // 1 byte
// Memory slot 1:
uint256 public ID = block.timestamp; // 32 bytes
// Memory slot 2:
uint8 private flattening = 10; // 1 byte
uint8 private denomination = 255; // 1 byte
uint16 private awkwardness = uint16(now); // 2 bytes
// Memory slot 3, 4, 5:
bytes32[3] private data; // 32 bytes x 3
```
We read the memory for the contract at slot 5, which will give us a ```bytes32``` value containing the ```data[2]``` value. We then cast that to a ```bytes16``` and call the ```unlock(bytes16 _key)``` function in the ```Privacy``` contract.

```javascript
// Read storage at slot index 5
await web3.eth.getStorageAt('<contract address>', 5);
```

Source contract: [contracts/Privacy.sol](contracts/Privacy.sol)  
Solution contract: [contracts/Privacy_Hack.sol](contracts/Privacy_Hack.sol)  
Test: [test/E12_Privacy.test.js](test/E12_Privacy.test.js)

---
## Ethernaught 13: [GatekeeperOne](https://ethernaut.openzeppelin.com/level/0x9b261b23cE149422DE75907C6ac0C30cEc4e652A)

**Challenge**: Successfully call the ```enter(bytes8 _gateKey)``` function with a parameter value that satisfies various conditions.

**Exploit**: Understanding the difference between ```tx.origin``` and ```msg.sender```, byte level implications of variable size conversions, and how to track gas costs

**Solution**: This write up will be a bit long, given the amount of logic that needs to go into solving this challenge. The following conditions must be met to get past the 3 gates:  
Gate 1  
```msg.sender != tx.origin```  
Gate 2  
```gasleft().mod(8191) == 0```  
Gate 3  
```uint32(uint64(_gateKey)) == uint16(uint64(_gateKey))```  
```uint32(uint64(_gateKey)) != uint64(_gateKey)```  
```uint32(uint64(_gateKey)) == uint16(tx.origin)```  

**Gate 1**  
Here we just need to call the ```enter()``` function from a contract. Our own EOA (Externally Owned Account) address we use to initiate the function in our attack contract will be ```tx.origin```, while the contract itself will be ```msg.sender``` allowing us past this gate.

**Gate 2**  
For gate 2, we need to calculate the gas consumed by our contract, then make sure there is some amount evenly divisable by 8191 left when we are calling the ```enter()``` function by sending the correct starting amount. We can use a debugger to get the exact amount of gas used leading up to our call to the ```gateTwo()``` modifier, and then calculate how much gas we need to send so the ```gasleft().mod(8191) == 0``` check will pass.

However, since the amount of gas per opcode can change with each Ethereum hardfork, and since we are running our test using the Hardhat network, we can brute force the correct amount over a narrow range that might allow this to keep working as long as the gas cost for the involved op codes aren't modified too drastically. At the time I am writing this, it is costing 307 gas leading up to the ```gateTwo()``` modifier call. So in our test for this challenge, I start with a "baseGas" amount of 819100 (a number where % 8191 = 0), and then add gas over a range from 240 to 400 more, to cover the cost up to that point. This allows us to loop 160 times at most, which should take only a few seconds.

**Gate 3**  
To get past gate 3, we need to know a few things about the underlying hexidecimal data representing variable types:

1. ```bytes8``` numbers looks like this in hex: ```0xFFFFFFFFFFFFFFFF``` (16 digits, 2 digits per ```byte```)
2. ```uint8``` takes up 1 ```byte```, which requires 2 hex digits: ```0xFF```.  ```uint16``` is 2 ```bytes``` (```0xFFFF```), ```uint32``` is 4 ```bytes``` (```0xFFFFFFFF```), etc.
3. ```uint64``` is 8 ```bytes``` and the same length as a ```bytes8``` (```0xFFFFFFFFFFFFFFFF```)
4. To convert a ```bytes``` to ```uint```, Solidity now requires they be of equal size. So in the ```GatekeeperOne``` contract, you may notice the ```bytes8 _getKey``` is always converted to ```uint64``` first before other ```uint``` conversions.
5. Converting a ```uint``` type to a larger type adds padding bytes on the left, converting to a smaller type removes bytes from the left.
6. Solidity supports "bit masking" which lets us directly manipulate specific digits in a hex number.

So looking at the 3 ```require``` statments in gate 3:

1. ```require(uint32(uint64(_gateKey)) == uint16(uint64(_gateKey))```

In this statment we are taking a ```bytes8``` such as ```0xFFFFFFFFFFFFFFFF```, and first converting it to a ```uint64``` (which is the same size, as required to change from ```uint``` to ```bytes```) and then reducing to ```uint32``` on the left, ```uint16``` on the right:

```0xFFFFFFFF == 0xFFFF```

For those 2 numbers to be equal as required, we see we need to make sure the first 2 ```bytes``` (4 digits) in our gate key are zeros, since an upconvert on the uint16 term will add zeros in those spots:

```0xFFFFFFFF0000FFFF```

2. ```require(uint32(uint64(_gateKey)) != uint64(_gateKey))```

Continuing with the pattern we have so far, we now need to make sure the original ```uint64``` does not match the ```uint32``` conversion:

```0x0000FFFF != 0xFFFFFFFF0000FFFF```

This requirement will pass as long as anything in the first 4 ```bytes``` of the ```uint64``` conversion is non-zero.

3. ```require(uint32(uint64(_gateKey)) == uint16(tx.origin))```

Here we require that the ```uint32``` of ```_gateKey``` match the ```uint16``` of the address ```tx.origin```. So this gives us our actual value we need for ```_gateKey```. 

An ETH address is 20 ```bytes```. If for example if ```tx.origin``` address was ```0x1ABC7154748D1CE5144478CDEB574AE244B939B5```:

Conversion to ```uint16``` = ```0x39B5```  
Conversion to ```uint32``` = ```0x44B939B5```  

Based on what we found for requirements 1 & 2 above, we can see what we need for ```_gateKey``` is to take our ```tx.origin``` address, and change the first 2 bytes at the start of the ```uint32``` conversion to zeros. With the example address we used, we would need this: ```0x1ABC7154748D1CE5144478CDEB574AE2000039B5``` (last 8 digits have the first 4 changed to zeros: ```000039B5```).

Finally we can see we can get the key we need using the bitmask operator ```&``` with the pattern we detailed above, on the ```bytes8``` conversion of the ```tx.origin``` address:

```bytes8 _gateKey = bytes8(tx.origin) & 0xFFFFFFFF0000FFFF;```

Source contract: [contracts/GatekeeperOne.sol](contracts/GatekeeperOne.sol)  
Solution contract: [contracts/GatekeeperOne_Hack.sol](contracts/GatekeeperOne_Hack.sol)  
Test: [test/E13_GatekeeperOne.test.js](test/E13_GatekeeperOne.test.js)

---
## Ethernaught 14: [GatekeeperTwo](https://ethernaut.openzeppelin.com/level/0xdCeA38B2ce1768E1F409B6C65344E81F16bEc38d)

**Challenge**: Like GatekeeperOne, successfully call the ```enter(bytes8 _gateKey)``` function with a parameter value that satisfies various new conditions.

**Exploit**: Understanding contract creation sequence, and  commutative math equations (which I am not sure has anything to do with smart contracts in general)

**Solution**

**Gate 1**  
As in GateKeeperOne, we just need to call the ```enter()``` function from a contract.

**Gate 2**  
For gate 2, we need ```extcodesize == 0```. The key here is knowing that a contract will have a code size of 0 prior to it being fully created. So if we attack the GatekeeperTwo contract from within the constructor for our hack contract, it will pass this requirement.

**Gate 3**  
To get past gate 3, the following is required:

```uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ uint64(_gateKey) == uint64(0)-1```

This can be written as:  
```a ^ b = c```

You would need to know that the equation above is commutative (I didn't), meaning the order of the terms can be rearranged, with the following being valid:  
```a ^ c = b```

Knowing this, we can solve for our needed ```gatekey```, which is part of term b in the above equations.

Source contract: [contracts/GatekeeperTwo.sol](contracts/GatekeeperTwo.sol)  
Solution contract: [contracts/GatekeeperTwo_Hack.sol](contracts/GatekeeperTwo_Hack.sol)  
Test: [test/E14_GatekeeperTwo.test.js](test/E14_GatekeeperTwo.test.js)

---
## Ethernaught 15: [NaughtCoin](https://ethernaut.openzeppelin.com/level/0x096bb5e93a204BfD701502EB6EF266a950217218)

**Challenge**: You are given a large amount of ERC20 tokens on a 10 year transfer timelock. Get your token balance to zero, preferably without waiting 10 years.

**Exploit**: Familiarity with the ERC20 specification

**Solution**: The key to this one is looking at the ERC20 contract it inherits from. The ```transfer()``` function implementation in the ```NaughtCoin``` contract has a 10 year restriction implemented as a ```lockTokens``` modifier. But there is another option for transferring an ERC20 token: ```transferFrom()```. That function has not been overridden in the ```NaughtCoin``` contract, so the base ERC20 implementation can be used without the ```lockTokens``` restriction.

Source contract: [contracts/NaughtCoin.sol](contracts/NaughtCoin.sol)  
Test: [test/E15_NaughtCoin.test.js](test/E15_NaughtCoin.test.js)

---
## Ethernaught 16: [Preservation](https://ethernaut.openzeppelin.com/level/0x97E982a15FbB1C28F6B8ee971BEc15C78b3d263F)

**Challenge**: Claim ownership of the contract

**Exploit**: ```delegatecall()``` used to overwrite contract memory

**Solution**: ```Preservation``` makes ```a delegatecall()```  in ```setFirstTime(uint _timeStamp)``` to the ```LibraryContract```, calling ``setTime(uint _time)``, which sets a ```uint``` value in storage slot 0 (called ```storedTime``` in the ```LibraryContract```. This will overwrite ```address public timeZone1Library``` variable in the ```Preservation``` contract. If we call ```setFirstTime(uint _timeStamp)```, but pass in a contract address for our own contract, this will get set as the new ```timeZone1Library``` address. Making another call to ```setFirstTime(uint _timeStamp)``` in the ```Library``` contract will then invoke a ```delegatecall()``` to our own contract, where we can intentionally overwrite the 3rd variable declared in the ```Preservation``` contract, which is ```address public owner```.

Source contract: [contracts/Preservation.sol](contracts/Preservation.sol)  

---
## Ethernaught 17: [Recovery](https://ethernaut.openzeppelin.com/level/0x0EB8e4771ABA41B70d0cb6770e04086E5aee5aB2)

**Challenge**: Recover a lost contract address and clear its funds 

**Exploit**: Understanding Etherscan internal transactions, and/or new Ethereum address generation rules.

**Solution**: There are 2 ways to get the contract address you need to solve this challenge. If you "Get new instance" from the [Ethernaught Recovery](https://ethernaut.openzeppelin.com/level/0x0EB8e4771ABA41B70d0cb6770e04086E5aee5aB2) page, you will given the Ethernaught instance address which itself deployed the challenge contract.

**Using etherscan**  
Looking up the instance contract on [Rinkeby Etherscan](https://rinkeby.etherscan.io/), you can go to the "Internal Txns" tab, which shows contract to contract interactions. There will be two entries for "Contact Creation", the first being its own creation, and the second is the challenge contract it deployed. The second one will have a link taking you to the contract we need.

**Using contract address prediction**  
You could also derive the new contract address by knowing the instance address, and by knowing that this is the first contract created by that new instance. From the [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf) (see page 10, paragraph 84):

>The address of the new account is defined as being the
rightmost 160 bits of the Keccak-256 hash of the RLP
encoding of the structure containing only the sender and
the account nonce.

[RLP](https://eth.wiki/en/fundamentals/rlp) is Recursive Length Prefix, a way of encoding nested binary arrays. You could calculate the new address directly using the definition above, however ethers provides a convienient utility method [getContractAddress({ from, nonce })](https://docs.ethers.io/v5/api/utils/address/#utils--contract-addresses). Account nonce 0 is always a contracts own creation. Since this is the first contract created by the instance contract following its own creation, the nonce we need will be 1.
```javascript
// Using ethers to get the next contract address that will be created by an address
await ethers.utils.getContractAddress('<ethernaught instance address'>, 1);
```
After getting the contract address we need, we can call the ```destroy()``` function on the ```SimpleToken``` contract, which calls ```selfdestruct(address receiver)``` to have its ether balance sent to our address.

Source contract: [contracts/Recovery.sol](contracts/Recovery.sol)  

---
## Ethernaught 18: [MagicNum](https://ethernaut.openzeppelin.com/level/0x200d3d9Ac7bFd556057224e7aEB4161fED5608D0)

**Challenge**: Create a contract that responds to ```whatIsTheMeaningOfLife()``` with the [correct answer](https://en.wikipedia.org/wiki/Phrases_from_The_Hitchhiker%27s_Guide_to_the_Galaxy), but the contract code needs to be 10 opcodes at most

**Exploit**: Writing raw EVM bytecode

**Solution**: In order to create the most efficient code possible which meets the requirements, you would need to write raw EVM bytecode. Solving this one yourself means learning how to write assembly for Ethereum.

You can review the information in the [Official Solidity Documentation](https://docs.soliditylang.org/en/develop/assembly.html), or take a closer look at [EVM Opcodes](https://www.ethervm.io/). There are many other resources for learning Ethereum EVM bytecode available online. I myself spent some time exploring the topic, and have included a working test with functional bytecode, though I had to look up some hints in order to get that working.

Source contract: [contracts/MagicNum.sol](contracts/MagicNum.sol)  
Test: [test/E18_MagicNum.test.js](test/E18_MagicNum.test.js)

---
## Ethernaught 19: [AlienCodex](https://ethernaut.openzeppelin.com/level/0xda5b3Fb76C78b6EdEE6BE8F11a1c31EcfB02b272)

**Challenge**: Claim ownership of the contract

**Exploit**: Array length underflow. This applies to solidity versions prior to [v0.6.0](https://docs.soliditylang.org/en/v0.8.14/060-breaking-changes.html#explicitness-requirements).

**Solution**: The AlienCodex has an array ```bytes32[] public codex``` of length 0, and a function ```retract()``` that decrements the length of the array. Calling ```retract()``` creates an underflow that expands the length of the ```bytes32``` array to ```uint256``` max value, which is the entire storage memory allocated to any EVM contract. We then can calculate which index in the array will line up with the ```owner``` variable already in memory, and overwrite it by writing to the ```codex``` array at the correct index.

Source contract: [contracts/AlienCodex.sol](contracts/AlienCodex.sol)  
Solution contract: [contracts/AlienCodex_Hack.sol](contracts/AlienCodex_Hack.sol)  
Test: [test/E19_AlienCodex.test.js](test/E19_AlienCodex.test.js)

---
## Ethernaught 20: [Denial](https://ethernaut.openzeppelin.com/level/0xf1D573178225513eDAA795bE9206f7E311EeDEc3)

**Challenge**: Prevent the contract owner from receiving funds when ```withdraw()``` is called

**Exploit**: External call used to break contract execution. Challenge goal can be achieved by burning all remaining gas, or conducting a reentrancy attack that drains all funds.

**Solution**: After registering as a "partner" with ```setWithdrawPartner(address _partner)```, if the ```withdraw()``` is called funds are first transferred to the partner via ```call()``` method, before transferring funds to the owner. Create a contract that breaks the ```withdraw()``` function in the ```receive()``` fallback function, by either burning any remaining gas, or draining all funds via reentrancy.

Source contract: [contracts/Denial.sol](contracts/Denial.sol)  
Solution contract: [contracts/Denial_Hack.sol](contracts/Denial_Hack.sol)  
Test: [test/E20_Denial.test.js](test/E20_Denial.test.js)

---
## Ethernaught 21: [Shop](https://ethernaut.openzeppelin.com/level/0x3aCd4766f1769940cA010a907b3C8dEbCe0bd4aB)

**Challenge**: Get ```Shop``` contract variables ```isSold``` set to true, and ```price``` set lower then the initialized price of 100

**Exploit**: Logic manipulation by external contract

**Solution**: Similar to challenge 11, Elevator, the ```Shop``` contract makes 2 calls to an external ```Buyer``` contract (set to ```msg.sender```) to check the price paid in the ```buy()``` function. We again exploit that logic to return different values for the 2 calls.

The ```Shop``` contract ```buy()``` function sets ```isSold``` to true after the first ```buyer.price()``` call, as long as the value is greater than the current price. Create the ```Buyer``` contract, and implement the ```price()``` function so that it returns an amount < 100 if ```isSold``` is true, or > 100 if ```isSold``` is false.

Source contract: [contracts/Shop.sol](contracts/Shop.sol)  
Solution contract: [contracts/Shop_Hack.sol](contracts/Shop_Hack.sol)  
Test: [test/E21_Shop.test.js](test/E21_Shop.test.js)

---
## Ethernaught 22: [Dex](https://ethernaut.openzeppelin.com/level/0xC084FC117324D7C628dBC41F17CAcAaF4765f49e)

**Challenge**: Drain all of one token from a DEX

**Exploit**: Price oracle manipulation

**Solution**: The flaw in this simulated DEX is that price data for token swaps comes from a single source. In this case, price is calculated based on the amount of each token in the contract. We are given 10 each of token1 and token2 to start. The DEX contract has 100 of each token. Based on the way token price is calculated, we can perform series of swaps trading all assets we have available to one token, then the other, back and forth, causing the price of each token to shift in our favor until the contract is drained.

Note that a contract moving ERC20 requires that the owner first ```approve()``` the contract to do that. This challenge made that requirement simpler by providing its own ```approve()``` function on the ```Dex``` contract. You can read more about that on the [Ethernaught Dex](https://ethernaut.openzeppelin.com/level/0xC084FC117324D7C628dBC41F17CAcAaF4765f49e) page. In the code sample below we are calling this ```approve()``` function provided by the challenge contract.

"Get new instance" from the [Ethernaught Dex](https://ethernaut.openzeppelin.com/level/0xC084FC117324D7C628dBC41F17CAcAaF4765f49e) page, and then using console commands:

```javascript
// Get player balances for token1 and token2 (should be 10 each to start)
await contract.balanceOf(await contract.token1(), player).then(n=>n.toNumber());
await contract.balanceOf(await contract.token2(), player).then(n=>n.toNumber());

// Approve, and then swap all token1 for token2 
await contract.approve(contract.address, await contract.balanceOf(await contract.token1(), player).then(n=>n.toNumber()));

await contract.swap(await contract.token1(), await contract.token2(), await contract.balanceOf(await contract.token1(), player).then(n=>n.toNumber());

// Approve, and then swap all token2 for token1
await contract.approve(contract.address, await contract.balanceOf(await contract.token2(), player).then(n=>n.toNumber()));

await contract.swap(await contract.token2(), await contract.token1(), await contract.balanceOf(await contract.token2(), player).then(n=>n.toNumber());

// Approve, and then swap all token1 for token2 
await contract.approve(contract.address, await contract.balanceOf(await contract.token1(), player).then(n=>n.toNumber()));

await contract.swap(await contract.token1(), await contract.token2(), await contract.balanceOf(await contract.token1(), player).then(n=>n.toNumber());

// Continue until one of the tokens is fully drained...

```

Source contract: [contracts/Dex.sol](contracts/Dex.sol)  

---
## Remaining Challenges
Following are more recently added challenges I have yet to complete

### Ethernaught 23: [DexTwo](https://ethernaut.openzeppelin.com/level/0x5026Ff8C97303951c255D3a7FDCd5a1d0EF4a81a), Drain all tokens from a Dex

### Ethernaught 24: [PuzzleWallet](https://ethernaut.openzeppelin.com/level/0xe13a4a46C346154C41360AAe7f070943F67743c9), Become admin of a proxy contract

### Ethernaught 25: [Motorbike](https://ethernaut.openzeppelin.com/level/0x58Ab506795EC0D3bFAE4448122afa4cDE51cfdd2), ```selfdestruct()``` the ```Engine``` contract

### Ethernaught 26: [DoubleEntryPoint](https://ethernaut.openzeppelin.com/level/0x128BA32Ec698610f2fF8f010A7b74f9985a6D17c), Implement a ```Forta``` detection bot that raises correct alerts on the ```CryptoVault``` contract
