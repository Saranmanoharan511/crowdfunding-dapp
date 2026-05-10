import { ethers } from "ethers";

// Factory
export const FACTORY_ADDRESS = "0x52A53Ab79f9B3D85885b32AcFf4565e3a10035F0";

export const FACTORY_ABI = [
  "function createCampaign(string,string,uint256,uint256)",
  "function getAllCampaigns() view returns (tuple(address campaignAddress,address creator,string name,uint256 createdAt)[])",
  "function getUserCampaigns(address) view returns (tuple(address campaignAddress,address creator,string name,uint256 createdAt)[])"
];

export const getFactoryContract = (signerOrProvider) => {
  return new ethers.Contract(
    FACTORY_ADDRESS,
    FACTORY_ABI,
    signerOrProvider
  );
};

// Crowdfunding ABI
export const CROWDFUNDING_ABI = [
  "function campaignName() view returns (string)",
  "function campaignDescription() view returns (string)",
  "function fundingGoal() view returns (uint256)",
  "function deadline() view returns (uint256)",
  "function creator() view returns (address)",
  "function totalFundsRaised() view returns (uint256)",
  "function getContractBalance() view returns (uint256)",
  "function getAllTiers() view returns (tuple(string name,uint256 usdAmount,uint256 contributionCount,bool isActive)[])",
  "function contribute(uint256 _tierIndex) payable",
  "function addTier(string memory _name, uint256 _amount)",
  "function disableTier(uint256 _index)",
  "function getCampaignStatus() view returns (uint8)",
  "function createWithdrawRequest()",
  "function approveWithdraw()",
  "function withdrawFunds()",
  "function claimRefund()",
   "function getPrice() view returns (uint256)",
  "function togglePause()",
  "function extendDeadline(uint256 _daysToAdd)"
];

export const getCampaignContract = (address, signerOrProvider) => {
  return new ethers.Contract(
    address,
    CROWDFUNDING_ABI,
    signerOrProvider
  );
};