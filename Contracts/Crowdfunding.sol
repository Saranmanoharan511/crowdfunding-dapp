// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract Crowdfunding is ReentrancyGuard {

    AggregatorV3Interface internal immutable pricefeed;

    string public campaignName;
    string public campaignDescription;
    uint256 public fundingGoal;
    uint256 public deadline;
    address public immutable creator;
    bool public isPaused;
    uint256 public totalFundsRaised;

    enum CampaignState { Active, Successful, Failed }
    CampaignState public state;

    struct Tier {
        string name;
        uint256 usdAmount;
        uint256 contributionCount;
        bool isActive;
    }

    struct Contributor {
        uint256 totalContribution;
        mapping(uint256 => bool) participatedTiers;
    }

    struct WithdrawalRequest {
        uint256 amount;
        uint256 approvalWeight;
        bool completed;
        mapping(address => bool) approvals;
    }

    Tier[] public tiers;
    mapping(address => Contributor) public contributors;

    WithdrawalRequest public withdrawRequest;
    uint256 public totalContributors;

    event Contribution(address indexed user, uint256 amount, uint256 tierIndex);
    event FundsWithdrawn(address indexed creator, uint256 amount);
    event RefundClaimed(address indexed user, uint256 amount);
    event TierAdded(string name, uint256 amount);
    event TierDisabled(uint256 index);
    event CampaignPaused(bool status);

    event WithdrawRequestCreated(uint256 amount);
    event WithdrawApproved(address indexed contributor, uint256 weight);
    event WithdrawExecuted(uint256 amount);

    modifier onlyCreator() {
        require(msg.sender == creator, "Not campaign creator");
        _;
    }

    modifier campaignActive() {
        require(state == CampaignState.Active, "Campaign not active");
        _;
    }

    modifier notPaused() {
        require(!isPaused, "Contract is paused");
        _;
    }

    constructor(
        address _creator,
        string memory _name,
        string memory _description,
        uint256 _goal,
        uint256 _durationInDays,
        address _priceFeedAddress
    ) {
        campaignName = _name;
        campaignDescription = _description;
        fundingGoal = _goal;
        deadline = block.timestamp + (_durationInDays * 1 days);
        creator = _creator;
        state = CampaignState.Active;
        pricefeed = AggregatorV3Interface(_priceFeedAddress);
    }

    function getPrice() public view returns(uint256){
        (, int256 price, , ,)=pricefeed.latestRoundData();
        require(price > 0, "Chainlink price error");
        return uint256(price) * 1e10;
    }
    
    function getEthToUsd(uint256 _ethAmount) public view returns(uint256){
        uint256 ethPrice = getPrice();
        return (_ethAmount * ethPrice) / 1e18;
    }

    function _updateCampaignState() internal {
        if (state != CampaignState.Active) return;

        uint256 currentBalanceInUsd = getEthToUsd(address(this).balance);

        if(block.timestamp > deadline) {
            state = (currentBalanceInUsd >= fundingGoal)
                ? CampaignState.Successful
                : CampaignState.Failed;
        } else if(currentBalanceInUsd >= fundingGoal){
            state = CampaignState.Successful;
        }
    }

    function contribute(uint256 _tierIndex)
        external
        payable
        campaignActive
        notPaused
    {   
        require(_tierIndex < tiers.length, "Invalid tier");

        Tier storage selectedTier = tiers[_tierIndex];
        require(selectedTier.isActive, "Tier inactive");

        uint256 contributionInUsd = getEthToUsd(msg.value);
        uint256 buffer = (selectedTier.usdAmount * 1) / 100;

        require(
            contributionInUsd >= (selectedTier.usdAmount - buffer),
            "Insufficient ETH for USD tier"
        );

        Contributor storage contributor = contributors[msg.sender];

        if (contributor.totalContribution == 0) {
            totalContributors++;
        }

        selectedTier.contributionCount++;

        contributor.totalContribution += msg.value;
        contributor.participatedTiers[_tierIndex] = true;
        totalFundsRaised += msg.value;

        emit Contribution(msg.sender, msg.value, _tierIndex);

        _updateCampaignState();
    }

    function createWithdrawRequest() external onlyCreator {
        _updateCampaignState();

        require(state == CampaignState.Successful, "Campaign not successful");
        require(!withdrawRequest.completed, "Already executed");
        require(withdrawRequest.amount == 0, "Request already exists");

        withdrawRequest.amount = address(this).balance;
        withdrawRequest.approvalWeight = 0;

        emit WithdrawRequestCreated(withdrawRequest.amount);
    }

    function approveWithdraw() external {
        Contributor storage contributor = contributors[msg.sender];
        
        require(withdrawRequest.amount > 0, "No active request");
        require(contributor.totalContribution > 0, "Not contributor");
        require(!withdrawRequest.approvals[msg.sender], "Already voted");
        require(!withdrawRequest.completed, "Already executed");

        withdrawRequest.approvals[msg.sender] = true;
        withdrawRequest.approvalWeight += contributor.totalContribution;

        emit WithdrawApproved(msg.sender, contributor.totalContribution);
    }

    function withdrawFunds()
        external
        onlyCreator
        nonReentrant
    {
        _updateCampaignState();

        require(state == CampaignState.Successful, "Not successful");
        require(!withdrawRequest.completed, "Already withdrawn");

        require(
            withdrawRequest.approvalWeight * 2 >= totalFundsRaised,
            "Not enough approvals"
        );

        withdrawRequest.completed = true;

        uint256 amount = withdrawRequest.amount;
        require(amount > 0, "No funds");

        (bool success, ) = creator.call{value: amount}("");
        require(success, "Transfer failed");

        emit WithdrawExecuted(amount);
        emit FundsWithdrawn(creator, amount);
    }

    function claimRefund() external nonReentrant {
        _updateCampaignState();

        require(state == CampaignState.Failed, "Refund not allowed");

        Contributor storage contributor = contributors[msg.sender];
        uint256 amount = contributor.totalContribution;

        require(amount > 0, "No contribution");

        contributor.totalContribution = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Refund failed");

        emit RefundClaimed(msg.sender, amount);
    }

    function addTier(string memory _name, uint256 _amount)
        external
        onlyCreator
    {
        require(_amount > 0, "Invalid amount");

        tiers.push(Tier({
            name: _name,
            usdAmount: _amount,
            contributionCount: 0,
            isActive: true
        }));

        emit TierAdded(_name, _amount);
    }

    function disableTier(uint256 _index)
        external
        onlyCreator
    {
        require(_index < tiers.length, "Invalid index");

        tiers[_index].isActive = false;

        emit TierDisabled(_index);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function hadParticipatedInTier(address _user, uint256 _index)
        external
        view
        returns (bool)
    {
        return contributors[_user].participatedTiers[_index];
    }

    function getAllTiers() external view returns (Tier[] memory) {
        return tiers;
    }

    function getCampaignStatus() external view returns (CampaignState) {
        if (state == CampaignState.Active && block.timestamp > deadline) {
            uint256 currentBalanceInUsd = getEthToUsd(address(this).balance);
            return currentBalanceInUsd >= fundingGoal
                ? CampaignState.Successful
                : CampaignState.Failed;
        }
        return state;
    }

    function togglePause() external onlyCreator {
        isPaused = !isPaused;
        emit CampaignPaused(isPaused);
    }

    function extendDeadline(uint256 _daysToAdd)
        external
        onlyCreator
        campaignActive
    {
        require(block.timestamp < deadline, "Already ended");
        require(_daysToAdd <= 30, "Too long");

        deadline += _daysToAdd * 1 days;
    }

    receive() external payable {}
} 
