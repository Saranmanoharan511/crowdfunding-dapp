import { useEffect, useState, useContext } from "react";
import { Web3Context } from "../context/Web3Context";
import { getFactoryContract } from "../utils/contract";
import { useNavigate } from "react-router-dom";

const Campaigns = () => {
  const { provider } = useContext(Web3Context);

  const [campaigns, setCampaigns] = useState([]);

  const navigate = useNavigate();

  const fetchCampaigns = async () => {
    try {
      if (!provider) return;

      const contract = getFactoryContract(provider);

      const data = await contract.getAllCampaigns();

      setCampaigns(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [provider]);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      
      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto mb-14">

        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-10 shadow-2xl">
          
          <h1 className="text-5xl font-bold mb-4">
            Decentralized Crowdfunding
          </h1>

          <p className="text-lg text-slate-100 max-w-2xl">
            Support innovative blockchain projects securely and transparently using smart contracts.
          </p>

        </div>
      </div>

      {/* SECTION TITLE */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-3xl font-bold">
          Active Campaigns
        </h2>

        <p className="text-slate-400 mt-2">
          Explore and contribute to live campaigns
        </p>
      </div>

      {/* EMPTY STATE */}
      {campaigns.length === 0 ? (
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-16 text-center">
            
            <h2 className="text-3xl font-bold mb-4">
              No Campaigns Yet
            </h2>

            <p className="text-slate-400">
              Create the first campaign from the dashboard.
            </p>

          </div>
        </div>
      ) : (
        
        /* CAMPAIGN GRID */
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {campaigns.map((c, index) => (
            
            <div
              key={index}
              onClick={() =>
                navigate(`/campaign/${c.campaignAddress}`)
              }
              className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden cursor-pointer hover:scale-105 hover:border-cyan-400 transition duration-300 shadow-xl"
            >
              
              {/* CARD IMAGE SECTION */}
              <div className="h-48 bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500"></div>

              {/* CARD CONTENT */}
              <div className="p-6">

                <h2 className="text-2xl font-bold mb-4">
                  {c.name}
                </h2>

                <div className="mb-5">
                  <p className="text-slate-400 text-sm mb-2">
                    Creator
                  </p>

                  <p className="break-all text-slate-300">
                    {c.creator}
                  </p>
                </div>

                <div className="bg-slate-800 rounded-xl p-3 mb-5">
                  <p className="text-xs text-slate-400 mb-1">
                    Campaign Address
                  </p>

                  <p className="text-sm break-all">
                    {c.campaignAddress}
                  </p>
                </div>

                <button className="w-full bg-cyan-500 hover:bg-cyan-400 py-3 rounded-xl font-semibold transition duration-300">
                  View Campaign
                </button>

              </div>
            </div>

          ))}
        </div>
      )}
    </div>
  );
};

export default Campaigns;