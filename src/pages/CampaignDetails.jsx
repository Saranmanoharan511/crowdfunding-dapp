import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../context/Web3Context";
import { getCampaignContract } from "../utils/contract";
import { ethers } from "ethers";

const CampaignDetails = () => {
  const { address } = useParams();

  const { provider, signer, account } =
    useContext(Web3Context);

  const [data, setData] = useState({});
  const [tiers, setTiers] = useState([]);
  const [isCreator, setIsCreator] = useState(false);

  const [showTierForm, setShowTierForm] =
    useState(false);

  const [tierForm, setTierForm] = useState({
    name: "",
    amount: "",
  });

  const [ethPrice, setEthPrice] = useState(0);

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      if (!provider) return;

      const contract = getCampaignContract(
        address,
        provider
      );

      const name = await contract.campaignName();
      const desc =
        await contract.campaignDescription();

      const goal = await contract.fundingGoal();

      const deadline = await contract.deadline();

      const balance =
        await contract.getContractBalance();

      const status = Number(
        await contract.getCampaignStatus()
      );

      const tiers = await contract.getAllTiers();

      const creator = await contract.creator();

      const price = await contract.getPrice();

      setEthPrice(price);

      setIsCreator(
        account?.toLowerCase() ===
          creator.toLowerCase()
      );

      setData({
        name,
        desc,
        goal: goal.toString(),
        deadline: new Date(
          Number(deadline) * 1000
        ).toLocaleString(),

        balance: ethers.formatEther(balance),

        status,
      });

      setTiers(tiers);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [provider, account]);

  // USD → ETH
  const calculateEth = (usdAmount) => {
    if (!ethPrice) return 0n;

    const usd = BigInt(usdAmount);

    const wei =
      (usd * 10n ** 18n * 10n ** 8n) /
      ethPrice;

    return wei;
  };

  const handleTierChange = (e) => {
    setTierForm({
      ...tierForm,
      [e.target.name]: e.target.value,
    });
  };

  // ADD TIER
  const addTier = async () => {
    try {
      if (!signer) {
        alert("Connect Wallet");
        return;
      }

      const contract = getCampaignContract(
        address,
        signer
      );

      const tx = await contract.addTier(
        tierForm.name,
        Number(tierForm.amount)
      );

      await tx.wait();

      alert("Tier Added");

      setShowTierForm(false);

      setTierForm({
        name: "",
        amount: "",
      });

      fetchData();

    } catch (err) {
      console.error(err);
      alert("Failed To Add Tier");
    }
  };

  // CONTRIBUTE
  const contribute = async (
    index,
    usdAmount
  ) => {
    try {
      setLoading(true);

      if (!signer) {
        alert("Connect Wallet");
        return;
      }

      const contract = getCampaignContract(
        address,
        signer
      );

      const weiValue =
        calculateEth(usdAmount);

      const finalWei =
        (weiValue * 105n) / 100n;

      const tx = await contract.contribute(
        index,
        {
          value: finalWei,
        }
      );

      await tx.wait();

      alert("Contribution Successful");

      fetchData();

    } catch (err) {
      console.error(err);
      alert("Contribution Failed");
    } finally {
      setLoading(false);
    }
  };

  // REFUND
  const claimRefund = async () => {
    try {
      const contract = getCampaignContract(
        address,
        signer
      );

      const tx =
        await contract.claimRefund();

      await tx.wait();

      alert("Refund Claimed");

      fetchData();

    } catch (err) {
      console.error(err);
      alert("Refund Failed");
    }
  };

  // DISABLE TIER
  const disableTier = async (index) => {
    const contract = getCampaignContract(
      address,
      signer
    );

    const tx =
      await contract.disableTier(index);

    await tx.wait();

    fetchData();
  };

  // PAUSE
  const togglePause = async () => {
    const contract = getCampaignContract(
      address,
      signer
    );

    const tx =
      await contract.togglePause();

    await tx.wait();

    fetchData();
  };

  // WITHDRAW
  const createWithdrawRequest =
    async () => {
      const contract =
        getCampaignContract(address, signer);

      const tx =
        await contract.createWithdrawRequest();

      await tx.wait();

      alert("Withdraw Request Created");
    };

  const approveWithdraw = async () => {
    const contract = getCampaignContract(
      address,
      signer
    );

    const tx =
      await contract.approveWithdraw();

    await tx.wait();

    alert("Withdraw Approved");
  };

  const withdrawFunds = async () => {
    const contract = getCampaignContract(
      address,
      signer
    );

    const tx =
      await contract.withdrawFunds();

    await tx.wait();

    alert("Funds Withdrawn");
  };

  // STATUS TEXT
  const getStatusText = (status) => {
    if (status === 0) return "Active";
    if (status === 1) return "Successful";
    if (status === 2) return "Failed";
  };

  // STATUS COLOR
  const getStatusColor = (status) => {
    if (status === 0)
      return "bg-green-500";

    if (status === 1)
      return "bg-cyan-500";

    if (status === 2)
      return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      
      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl mb-10">
          
          {/* TOP BANNER */}
          <div className="h-72 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>

          {/* CONTENT */}
          <div className="p-10">

            {/* TITLE */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5 mb-6">
              
              <div>
                <h1 className="text-5xl font-bold mb-3">
                  {data.name}
                </h1>

                <p className="text-slate-400 text-lg">
                  {data.desc}
                </p>
              </div>

              <div
                className={`${getStatusColor(
                  data.status
                )} px-5 py-3 rounded-2xl font-bold`}
              >
                {getStatusText(data.status)}
              </div>
            </div>

            {/* STATS */}
            <div className="grid md:grid-cols-3 gap-6">

              <div className="bg-slate-800 rounded-2xl p-6">
                <p className="text-slate-400 mb-2">
                  Funding Goal
                </p>

                <h2 className="text-3xl font-bold">
                  ${data.goal}
                </h2>
              </div>

              <div className="bg-slate-800 rounded-2xl p-6">
                <p className="text-slate-400 mb-2">
                  Raised
                </p>

                <h2 className="text-3xl font-bold text-cyan-400">
                  {data.balance} ETH
                </h2>
              </div>

              <div className="bg-slate-800 rounded-2xl p-6">
                <p className="text-slate-400 mb-2">
                  Deadline
                </p>

                <h2 className="text-lg font-bold">
                  {data.deadline}
                </h2>
              </div>

            </div>

          </div>
        </div>

        {/* CREATOR CONTROLS */}
        {isCreator && (
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 mb-10">
            
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5 mb-8">

              <h2 className="text-3xl font-bold">
                Creator Controls
              </h2>

              <button
                onClick={() =>
                  setShowTierForm(true)
                }
                className="bg-cyan-500 hover:bg-cyan-400 px-6 py-3 rounded-2xl font-semibold transition"
              >
                + Add Tier
              </button>
            </div>

            {/* TIER FORM */}
            {showTierForm && (
              <div className="grid gap-5">

                <input
                  name="name"
                  placeholder="Tier Name"
                  value={tierForm.name}
                  onChange={handleTierChange}
                  className="bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-cyan-400"
                />

                <input
                  name="amount"
                  type="number"
                  placeholder="Tier Amount (USD)"
                  value={tierForm.amount}
                  onChange={handleTierChange}
                  className="bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-cyan-400"
                />

                <div className="flex gap-4">

                  <button
                    onClick={addTier}
                    className="bg-cyan-500 hover:bg-cyan-400 px-6 py-3 rounded-2xl font-semibold"
                  >
                    Add Tier
                  </button>

                  <button
                    onClick={() =>
                      setShowTierForm(false)
                    }
                    className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-2xl"
                  >
                    Cancel
                  </button>

                </div>
              </div>
            )}

            {/* CREATOR ACTIONS */}
            <div className="flex flex-wrap gap-4 mt-8">

              <button
                onClick={togglePause}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-2xl font-semibold"
              >
                Pause / Resume
              </button>

              {data.status === 1 && (
                <>
                  <button
                    onClick={
                      createWithdrawRequest
                    }
                    className="bg-purple-500 hover:bg-purple-400 px-6 py-3 rounded-2xl font-semibold"
                  >
                    Create Withdraw Request
                  </button>

                  <button
                    onClick={withdrawFunds}
                    className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-2xl font-semibold"
                  >
                    Withdraw Funds
                  </button>
                </>
              )}

            </div>
          </div>
        )}

        {/* TIERS */}
        <div>

          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-3">
              Contribution Tiers
            </h2>

            <p className="text-slate-400">
              Support this campaign by choosing a tier
            </p>
          </div>

          {tiers.length === 0 ? (
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-16 text-center">
              
              <h2 className="text-3xl font-bold mb-3">
                No Tiers Available
              </h2>

              <p className="text-slate-400">
                Creator has not added tiers yet.
              </p>

            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {tiers.map((tier, index) => (
                <div
                  key={index}
                  className="bg-slate-900 border border-slate-700 rounded-3xl p-8 hover:border-cyan-400 transition duration-300 shadow-xl"
                >
                  
                  <div className="mb-6">

                    <h2 className="text-3xl font-bold mb-3">
                      {tier.name}
                    </h2>

                    <p className="text-5xl font-bold text-cyan-400">
                      ${tier.usdAmount.toString()}
                    </p>

                  </div>

                  <div className="space-y-3 mb-8">

                    <div className="flex justify-between">
                      <p className="text-slate-400">
                        Contributions
                      </p>

                      <p>
                        {tier.contributionCount.toString()}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-slate-400">
                        ETH Equivalent
                      </p>

                      <p>
                        ≈{" "}
                        {ethers.formatEther(
                          calculateEth(
                            tier.usdAmount
                          )
                        )}{" "}
                        ETH
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-slate-400">
                        Status
                      </p>

                      <p>
                        {tier.isActive
                          ? "Active"
                          : "Disabled"}
                      </p>
                    </div>

                  </div>

                  {/* USER CONTRIBUTE */}
                  {tier.isActive &&
                    !isCreator && (
                      <button
                        disabled={loading}
                        onClick={() =>
                          contribute(
                            index,
                            tier.usdAmount
                          )
                        }
                        className="w-full bg-cyan-500 hover:bg-cyan-400 py-4 rounded-2xl font-bold transition duration-300"
                      >
                        {loading
                          ? "Processing..."
                          : "Contribute"}
                      </button>
                    )}

                  {/* CREATOR DISABLE */}
                  {isCreator &&
                    tier.isActive && (
                      <button
                        onClick={() =>
                          disableTier(index)
                        }
                        className="w-full bg-red-500 hover:bg-red-400 py-4 rounded-2xl font-bold transition duration-300"
                      >
                        Disable Tier
                      </button>
                    )}

                </div>
              ))}

            </div>
          )}
        </div>

        {/* REFUND */}
        {data.status === 2 && (
          <div className="mt-10">
            <button
              onClick={claimRefund}
              className="bg-red-500 hover:bg-red-400 px-8 py-4 rounded-2xl font-bold"
            >
              Claim Refund
            </button>
          </div>
        )}

        {/* APPROVE */}
        {!isCreator &&
          data.status === 1 && (
            <div className="mt-10">
              <button
                onClick={approveWithdraw}
                className="bg-green-500 hover:bg-green-400 text-black px-8 py-4 rounded-2xl font-bold"
              >
                Approve Withdraw
              </button>
            </div>
          )}

      </div>
    </div>
  );
};

export default CampaignDetails;