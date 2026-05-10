// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Crowdfunding.sol";

contract CrowdfundingFactory {

    address public immutable admin;
    address public immutable priceFeedAddress;
    bool public isPaused;

    struct CampaignDetails {
        address campaignAddress;
        address creator;
        string name;
        uint256 createdAt;
    }

    CampaignDetails[] public allCampaigns;
    mapping(address => CampaignDetails[]) public campaignsByUser;

    event CampaignCreated(address indexed campaign, address indexed creator, string name);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier notPaused() {
        require(!isPaused, "Factory paused");
        _;
    }

    constructor(address _priceFeedAddress) {
        admin = msg.sender;
        priceFeedAddress = _priceFeedAddress;
    }

    function createCampaign(
        string memory _name,
        string memory _description,
        uint256 _goalUSD,
        uint256 _durationInDays
    ) external notPaused {

        Crowdfunding campaign = new Crowdfunding(
            msg.sender,
            _name,
            _description,
            _goalUSD,
            _durationInDays,
            priceFeedAddress
        );

        CampaignDetails memory newCampaign = CampaignDetails({
            campaignAddress: address(campaign),
            creator: msg.sender,
            name: _name,
            createdAt: block.timestamp
        });

        allCampaigns.push(newCampaign);
        campaignsByUser[msg.sender].push(newCampaign);

        emit CampaignCreated(address(campaign), msg.sender, _name);
    }

    function getAllCampaigns()
        external
        view
        returns (CampaignDetails[] memory)
    {
        return allCampaigns;
    }

    function getUserCampaigns(address _user)
        external
        view
        returns (CampaignDetails[] memory)
    {
        return campaignsByUser[_user];
    }

    function togglePause() external onlyAdmin {
        isPaused = !isPaused;
    }
}
