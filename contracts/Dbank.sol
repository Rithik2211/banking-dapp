// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
  
contract Dbank  {
    address public immutable owner;
    bool private locked;
    struct Deposit {
        uint256 amount; 
        string name;
        uint256 depositTime;
    }
    struct Transfer {
        uint256 amount; 
        address receiver;
        uint256 depositTime;
    }
    struct Withdraw {
        uint256 amount; 
        uint256 wthdrawTime;
    }
    struct PendingWithdrawls {
        uint256 amount;
        uint256 requestTime;
        bool isPending;
    }
    uint256 public constant MIN_DEPOSIT = 0.01 ether;
    uint256 private constant WITHDRAWAL_DELAY = 1 minutes; // Can be adjusted for security

    //state 
    mapping(address => Deposit[]) public deposits;
    mapping(address => Transfer[]) public tranfers;
    mapping(address=> Withdraw[]) public withdraws;
    mapping(address => uint256) public balances;
    mapping(address => PendingWithdrawls) public pendingPayments;
    mapping(address => uint256) public lastWithdrawls;

    //receiver => ethers  // cam wihtdraw 
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status = _NOT_ENTERED;

    modifier nonReentrant() {
    require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
    _status = _ENTERED;
    _;
    _status = _NOT_ENTERED;
    }
    constructor() {
        owner = msg.sender;
        _status = _NOT_ENTERED;
    }

   // Events
    event DepositMade(address indexed user, uint256 amount, string name);
    event WithdrawalRequested(address indexed user, uint256 amount, uint256 requestTime);
    event WithdrawalCompleted(address indexed user, uint256 amount);
    event FundsTransferred(address indexed from, address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the Owner");
        _;
    }
    receive() external payable {
        balances[msg.sender] += msg.value;
        //updates the balance of contract 
    }    
    fallback() external payable {
        //updates the balance of contract 
        balances[msg.sender] += msg.value;
    }

    function DepositMoney(string memory _name) public payable {
        require(msg.value >= MIN_DEPOSIT, "must deposit some balance");
        _handleDeposit( _name);

    }

    function _handleDeposit(string memory _name) private{
            balances[msg.sender] += msg.value;
            deposits[msg.sender].push(Deposit(msg.value, _name, block.timestamp));
            emit DepositMade(msg.sender,msg.value, _name);

    }

    function Reqwithdraw(uint256 amount) public nonReentrant {
        require(balances[msg.sender] >= amount, "insufficient amount");
        require(!pendingPayments[msg.sender].isPending,"You have to claim previous withdraw first");
        require(amount>0,"amount should be greater than 0");
        balances[msg.sender] -= amount;
        pendingPayments[msg.sender]= PendingWithdrawls(amount,block.timestamp,true);
        withdraws[msg.sender].push(Withdraw(amount, block.timestamp));
        emit WithdrawalRequested(msg.sender, amount, block.timestamp);
        // emit MoneyWithdrawn(msg.sender, amount);
    }
    function claimWithdraw() public nonReentrant {
        PendingWithdrawls storage Withdrawl= pendingPayments[msg.sender];
        require(Withdrawl.isPending,"No pending withdrwals");
        require(block.timestamp >= Withdrawl.requestTime + WITHDRAWAL_DELAY,
            "Withdrawal delay not met");
            // (bool success, ) = payable(msg.sender).call{value: Withdrawl.amount}("");
         delete pendingPayments[msg.sender];
        //  require(success, "Transfer failed");
         emit WithdrawalCompleted(msg.sender,  Withdrawl.amount);

    }
    

    function TransferMoney(uint256 amount, address _to) public nonReentrant{
        require(_to != address(0), "Invalid recipient address");
        require(balances[msg.sender] >= amount, "insufficient amount"); 
        require(amount>0,"amount should be greater than");
        unchecked{
        balances[msg.sender] -= amount;
        balances[_to] += amount;
        }       
        
        tranfers[msg.sender].push(Transfer(amount,_to,block.timestamp));
        emit FundsTransferred(msg.sender, _to,amount);
    }


  
    function checkBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
    function checkpendings() public view returns (uint256) {
        return pendingPayments[msg.sender].amount;
        }
    //views
     function getAlltransfers() public view returns (Transfer[] memory) {
        return tranfers[msg.sender];
    }   
      function getAllDepositss() public view returns (Deposit[] memory) {
        return deposits[msg.sender];
    }
         function getAllWithdraws() public view returns (Withdraw[] memory) {
        return withdraws[msg.sender];
    }

}