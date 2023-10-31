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
    // Orders mapping
    mapping(uint256 => _Order) public orders;
    uint256 public orderCount; // 0

    /* Events */
    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );
    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    // Way to model the order
    struct _Order {
        // Attributes of an order
        uint256 id; // Unique identifier of the order
        address user; // User who made order
        address tokenGet; // Address of the token they want to receive
        uint256 amountGet; // Amount they receive
        address tokenGive; // Address the token give
        uint256 amountGive; // Amount they give
        uint256 timestamp; // When the order was created
    }

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

    function withdrawToken(address _token, uint256 _amount) public {
        // Ensure user has enough tokens to withdraw
        require(tokens[_token][msg.sender] >= _amount);
        // Transfer tokens to the user
        Token(_token).transfer(msg.sender, _amount);
        // Update user balance
        tokens[_token][msg.sender] -= _amount;
        // Emit an  event
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function balanceOf(
        address _token,
        address _user
    ) public view returns (uint256) {
        return tokens[_token][_user];
    }

    // ------------------------
    // MAKE & CANCEL ORDERS
    // ------------------------
    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        // Prevent orders if tokens aren't on exchange
        require(balanceOf(_tokenGive, msg.sender) >= _amountGive);

        // Instiatiate new order
        // Token Give (the token they wan to spend) - which token, and how much?
        // Token Get (the token they want to receive) - which token, and how much?
        orderCount += 1;
        orders[orderCount] = _Order(
            orderCount, // id 1, 2, 3,...
            msg.sender, // user '0x0...abc123'
            _tokenGet, // tokenGet
            _amountGet, // amountGet
            _tokenGive, // tokenGive
            _amountGive, // amountGive
            block.timestamp // timestamp epoch time
        );

        // EMIT EVENT
        emit Order(
            orderCount, // id 1, 2, 3,...
            msg.sender, // user '0x0...abc123'
            _tokenGet, // tokenGet
            _amountGet, // amountGet
            _tokenGive, // tokenGive
            _amountGive, // amountGive
            block.timestamp // timestamp epoch time
        );
    }
}
