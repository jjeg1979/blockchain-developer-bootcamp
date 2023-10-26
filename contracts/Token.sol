//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// To be able to do console logging while deploying contracts
import "hardhat/console.sol";

contract Token{
    string public name;
    string public symbol;
    uint256 public decimals = 18;
    uint256 public totalSupply;

    // Track Balances
    // Mapping from address (KEY) to uint256 (Token Balance)
    mapping(address => uint256) public balanceOf;
    // Send Tokens
    
    
    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10 ** decimals);
        // msg.sender is a special address that points to the account that deployed the contract. msg is understood by Solidity
        // sender is the address that called this contract/token
        balanceOf[msg.sender] = totalSupply;
    }

    // Create Tokens and assignd to the account which deployed the Token to the Blockchain

}
