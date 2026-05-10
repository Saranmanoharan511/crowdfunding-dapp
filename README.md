# 🚀 Crowdfunding DApp

A modern decentralized crowdfunding platform built using Solidity, React, Vite, Ethers.js, and Tailwind CSS.

This project allows users to create blockchain-powered crowdfunding campaigns, contribute using ETH, manage contribution tiers, and securely withdraw funds through smart contract-based governance.

---

# ✨ Features

## 👤 User Features

* Connect wallet using MetaMask
* Browse all crowdfunding campaigns
* View detailed campaign information
* Contribute to campaigns using ETH
* Support campaigns through contribution tiers
* Claim refunds if campaigns fail
* Approve withdrawal requests for successful campaigns

---

## 🛠 Creator Features

* Create crowdfunding campaigns
* Set funding goal and campaign duration
* Add custom contribution tiers
* Pause or resume campaigns
* Disable contribution tiers
* Create withdrawal requests
* Withdraw raised funds securely

---

# 🧱 Tech Stack

## Frontend

* React
* Vite
* React Router DOM
* Tailwind CSS
* Ethers.js

## Blockchain

* Solidity
* Ethereum Smart Contracts
* MetaMask

---

# 📂 Project Structure

```bash
crowdfunding-dapp/
│
├── contracts/
│   ├── Campaign.sol
│   └── CampaignFactory.sol
│
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   │
│   ├── context/
│   │   └── Web3Context.jsx
│   │
│   ├── pages/
│   │   ├── Campaigns.jsx
│   │   ├── CampaignDetails.jsx
│   │   └── Dashboard.jsx
│   │
│   ├── utils/
│   │   └── contract.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/crowdfunding-dapp.git
```

---

## 2️⃣ Navigate Into Project

```bash
cd crowdfunding-dapp
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Start Development Server

```bash
npm run dev
```

---

# 🔗 Wallet Connection

Make sure you have:

* MetaMask installed
* Connected to the correct blockchain network
* Some test ETH for transactions

---

# 🧠 Smart Contract Functionalities

## Campaign Creation

Users can create crowdfunding campaigns with:

* Campaign name
* Description
* Funding goal
* Campaign duration

---

## Contribution Tiers

Creators can add custom contribution tiers.

Example:

* Bronze Supporter
* Silver Supporter
* Gold Supporter

Each tier has:

* Tier name
* USD amount
* Contribution count

---

## Withdrawal Governance

Successful campaigns require approval before funds can be withdrawn.

This adds:

* transparency
* contributor protection
* decentralized governance

---

## Refund System

If a campaign fails:

* contributors can claim refunds directly from the smart contract

---

# 🎨 UI Highlights

* Modern Web3 dark theme
* Responsive design
* Gradient hero sections
* Professional dashboard UI
* Interactive tier cards
* Tailwind CSS styling

---

# 📸 Future Improvements

* Toast notifications
* Campaign image uploads
* Framer Motion animations
* Search & filter system
* User profile pages
* Campaign categories
* Multi-chain support
* IPFS integration
* DAO governance features

---

# 🚀 Deployment

Frontend can be deployed easily using:

* Vercel
* Netlify
* Render

---

# 📜 License

This project is open-source and available under the MIT License.

---

# 👨‍💻 Author

Built with ❤️ using React + Solidity + Tailwind CSS.
