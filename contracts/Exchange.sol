//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// To be able to do console logging while deploying contracts
import "hardhat/console.sol";
import "./Token.sol";

contract Exchange { 
    address public feeAccount; // the account that receives exchange fees
    uint256 public feePercent; // the fee percentage

    // Mapping token address to user address to amount
    mapping(address => mapping(address => uint256)) public tokens;

    /* Events */
    event Deposit(
        address token, 
        address user, 
        uint256 amount, 
        uint256 balance
    );

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // ------------------------
    // DEPOSIT & WITHDRAW TOKEN
    // ------------------------
    function depositToken(address _token, uint256 _amount) public {
        // Transfer tokens to exchange
        // address(this) is the address of the contract Exchange to be referenced within the same contract
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        // Update user balance
        tokens[_token][msg.sender] += _amount;        
        // Emit an event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function balanceOf(address _token, address _user)
        public 
        view 
        returns (uint256) 
    {
        return tokens[_token][_user];
    }
}
