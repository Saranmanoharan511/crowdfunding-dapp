import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../context/Web3Context";
import { getFactoryContract } from "../utils/contract";

const Dashboard = () => {
  const { provider, account, signer } = useContext(Web3Context);

  const [myCampaigns, setMyCampaigns] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    goal: "",
    duration: "",
  });

  const fetchMyCampaigns = async () => {
    try {
      if (!provider || !account) return;

      const contract = getFactoryContract(provider);

      const data = await contract.getUserCampaigns(account);

      setMyCampaigns(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyCampaigns();
  }, [provider, account]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createCampaign = async () => {
    try {
      if (!signer) {
        alert("Connect Wallet First");
        return;
      }

      const contract = getFactoryContract(signer);

      const tx = await contract.createCampaign(
        form.name,
        form.description,
        Number(form.goal),
        Number(form.duration)
      );

      await tx.wait();

      alert("Campaign Created Successfully");

      setForm({
        name: "",
        description: "",
        goal: "",
        duration: "",
      });

      setShowForm(false);

      fetchMyCampaigns();

    } catch (err) {
      console.error(err);
      alert("Transaction Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-12">
        
        <div>
          <h1 className="text-5xl font-bold mb-3">
            Creator Dashboard
          </h1>

          <p className="text-slate-400">
            Manage and monitor your crowdfunding campaigns
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-cyan-500 hover:bg-cyan-400 px-6 py-4 rounded-2xl font-semibold shadow-lg shadow-cyan-500/20 transition duration-300"
        >
          + Create Campaign
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 mb-12">

        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8">
          <h2 className="text-slate-400 mb-3">
            Total Campaigns
          </h2>

          <p className="text-4xl font-bold text-cyan-400">
            {myCampaigns.length}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8">
          <h2 className="text-slate-400 mb-3">
            Connected Wallet
          </h2>

          <p className="text-sm break-all text-slate-300">
            {account || "Wallet Not Connected"}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8">
          <h2 className="text-slate-400 mb-3">
            Platform
          </h2>

          <p className="text-2xl font-bold text-purple-400">
            Ethereum
          </p>
        </div>

      </div>

      {/* CREATE FORM */}
      {showForm && (
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-700 rounded-3xl p-10 mb-14 shadow-2xl">
          
          <div className="flex justify-between items-center mb-8">
            
            <h2 className="text-3xl font-bold">
              Create New Campaign
            </h2>

            <button
              onClick={() => setShowForm(false)}
              className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl transition"
            >
              Close
            </button>
          </div>

          <div className="grid gap-6">

            <input
              name="name"
              placeholder="Campaign Name"
              value={form.name}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-cyan-400"
            />

            <textarea
              name="description"
              placeholder="Campaign Description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-cyan-400"
            />

            <input
              name="goal"
              type="number"
              placeholder="Funding Goal (USD)"
              value={form.goal}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-cyan-400"
            />

            <input
              name="duration"
              type="number"
              placeholder="Campaign Duration (Days)"
              value={form.duration}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-cyan-400"
            />

            <button
              onClick={createCampaign}
              className="bg-cyan-500 hover:bg-cyan-400 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-cyan-500/20 transition duration-300"
            >
              Launch Campaign
            </button>

          </div>
        </div>
      )}

      {/* MY CAMPAIGNS */}
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            My Campaigns
          </h2>

          <p className="text-slate-400">
            Campaigns you have created
          </p>
        </div>

        {myCampaigns.length === 0 ? (
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-16 text-center">
            
            <h2 className="text-3xl font-bold mb-4">
              No Campaigns Created
            </h2>

            <p className="text-slate-400">
              Create your first blockchain crowdfunding campaign.
            </p>

          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {myCampaigns.map((c, index) => (
              
              <div
                key={index}
                className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-xl hover:border-cyan-400 transition duration-300"
              >
                
                {/* TOP IMAGE SECTION */}
                <div className="h-40 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>

                {/* CONTENT */}
                <div className="p-6">

                  <h2 className="text-2xl font-bold mb-4">
                    {c.name}
                  </h2>

                  <div className="bg-slate-800 rounded-2xl p-4 mb-5">
                    
                    <p className="text-sm text-slate-400 mb-2">
                      Campaign Address
                    </p>

                    <p className="break-all text-sm">
                      {c.campaignAddress}
                    </p>

                  </div>

                  <button className="w-full bg-cyan-500 hover:bg-cyan-400 py-3 rounded-xl font-semibold transition duration-300">
                    Manage Campaign
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;