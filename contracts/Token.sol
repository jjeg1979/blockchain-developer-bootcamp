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

    // Create the allowance mapping
    mapping(address => mapping(address => uint256)) public allowance;

    // Events
    event Transfer(
        address indexed from, 
        address indexed to, 
        uint256 value
    );

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    
    
    constructor(
        string memory _name, 
        string memory _symbol, 
        uint256 _totalSupply) 
    {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10 ** decimals);
        // msg.sender is a special address that points to the account that deployed the contract. msg is understood by Solidity
        // sender is the address that called this function
        balanceOf[msg.sender] = totalSupply;
    }

    // Transfer Tokens function
    function transfer(address _to, uint256 _value) 
        public
        returns (bool success)
    {
        // Require that sender has enough tokens to spend
        _transfer(msg.sender, _to, _value);

        return true;
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _value
    ) internal {
        // Require that sender has enough tokens to spend
        require(balanceOf[_from] >= _value);
        require(_to != address(0));
        // Deduct tokens from spender        
        balanceOf[_from] -= _value;
        // Credit tokens to receiver
        balanceOf[_to] += _value;

        // Emit Transfer Event
        emit Transfer(_from, _to, _value);
    }

    function approve(address _spender, uint256 _value) 
        public
        returns (bool success)
    {
        require(_spender != address(0));
        // Allowance
        allowance[msg.sender][_spender] = _value;

        // Emit Approval Event
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) 
        public
        returns (bool success)
    {        
        // Check approval
        require(allowance[_from][msg.sender] >= _value);  
        // require(_value <= balanceOf[_from]);
        // Reset the allowance - Prevent double spending
        allowance[_from][msg.sender] -= _value;

        _transfer(_from, _to, _value);
        
        return true;
    }
}
