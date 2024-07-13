// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Game is ERC20,Ownable,ReentrancyGuard{
    mapping (address=>bool) public is_org_registered;
    mapping (address=>bool) public is_org_applied;

    struct Pending_token_user{
        address user_address;
        uint amount;
    }

    Pending_token_user[] pending_user_tokens;

    struct Registered_org{
        string name;
        string description;
        uint funds_remaining;
        address org_address;
        uint index;
    }

    mapping (address=>Registered_org) public registered_orgs;
    Registered_org[] public registered_org_arr;

    struct Pending_org{
        address org_address;
        string name;
        string description;
        uint funds_remaining;
    }

    Pending_org[] public org_queue;


    constructor() ERC20("Ghost Coins","GC") Ownable(msg.sender){
        _mint(address(this),5 * (10 ** 18));
    }

    function contract_balance()public view returns (uint){
        return balanceOf(address(this));
    }

    function register_org(address _org,string memory _name,string memory _description,uint _funds)public {
        require(_org != address(0), "Invalid organization address");
        require(!is_org_applied[_org],"already applied");
        require(!is_org_registered[_org],"already registered");

        org_queue.push(Pending_org(_org,_name, _description, _funds));
        is_org_applied[_org] = true;
    }

    function approve_org() public onlyOwner {
        uint index = registered_org_arr.length;
            for (uint i = 0; i < org_queue.length; i++) {
                Pending_org memory pending = org_queue[i];
                registered_orgs[pending.org_address] = Registered_org(pending.name, pending.description, pending.funds_remaining,pending.org_address,index);
                registered_org_arr.push(Registered_org(pending.name, pending.description, pending.funds_remaining,pending.org_address,index));
                is_org_registered[pending.org_address] = true;
                is_org_applied[pending.org_address] = false;
            }
        delete org_queue;
    }

    function get_registered_org()public view returns(Registered_org[] memory){
        return registered_org_arr;
    }

    function mintTokens(uint amount)public onlyOwner{
        _mint(msg.sender, amount);
    }

    function check_my_balance()public view returns(uint){
        return balanceOf(msg.sender);
    }

    function donate_to_organisation(address _org_address,uint amount)public nonReentrant{
        uint index = registered_orgs[_org_address].index;
        require(_org_address != address(0), "Invalid organization address");
        require(amount>0,"invalid amount");
        require(balanceOf(msg.sender)>=amount,"insufficient balance");
        require(amount<= registered_orgs[_org_address].funds_remaining,"crossing limts of required amount");
        transfer(_org_address,amount);
        registered_orgs[_org_address].funds_remaining -= amount;
        registered_org_arr[index].funds_remaining -=amount;
    }   

    function getTokens(uint amount)public {
        _approve(address(this), msg.sender, amount);
        require(amount>0,"invalid amount");
        if(balanceOf(address(this)) <= amount){
            pending_user_tokens.push(Pending_token_user(msg.sender, amount));
        }
        else{

        bool success = transferFrom(address(this), msg.sender,amount);
        require(success,"transfer failed");
        }
    }

    function distribute_pending_tokens() public onlyOwner {
        for (uint i = 0; i < pending_user_tokens.length; i++) {
            Pending_token_user memory pending = pending_user_tokens[i];
            if (balanceOf(address(this)) >= pending.amount) {
                bool success = transfer(pending.user_address, pending.amount);
                require(success, "transfer failed");
                delete pending_user_tokens[i];
            }
        }
    }
}