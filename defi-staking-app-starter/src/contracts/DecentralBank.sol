pragma solidity ^0.5.0;
import './RWD.sol';
import './Tether.sol';


contract DecentralBank {
    string public name = 'Decentralised Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd,Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    function depositTokens(uint amount) public {
        require(amount > 0, 'Amount should be greater than 0');

        tether.transferFrom(msg.sender, address(this), amount);

        stakingBalance[msg.sender] = stakingBalance[msg.sender] + amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    function issueRewards() public {
        require(msg.sender == owner, 'caller must be owner');

        for (uint i=0; i < stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 9;
            if(balance > 0){
                rwd.transfer(recipient, balance);
            }
        }
    }

    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, 'staking balance should be more than zero');

        tether.transfer(msg.sender, balance);

        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
        hasStaked[msg.sender] = false;
    }
}