import { Link } from "react-router-dom";
import { useContext } from "react";
import { Web3Context } from "../context/Web3Context";

const Navbar = () => {
  const { account, connectWallet } = useContext(Web3Context);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-8">

          {/* LOGO */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            CrowdFundX
          </h1>

          {/* NAV LINKS */}
          <div className="flex gap-6 text-slate-300 font-medium">

            <Link
              to="/"
              className="hover:text-cyan-400 transition duration-300"
            >
              Campaigns
            </Link>

            <Link
              to="/dashboard"
              className="hover:text-cyan-400 transition duration-300"
            >
              Dashboard
            </Link>

          </div>
        </div>

        {/* RIGHT SECTION */}
        <div>
          {account ? (
            <button className="bg-cyan-500 hover:bg-cyan-400 px-5 py-2 rounded-xl font-semibold shadow-lg shadow-cyan-500/20 transition duration-300">
              {account.slice(0, 6)}...
              {account.slice(-4)}
            </button>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-cyan-500 hover:bg-cyan-400 px-5 py-2 rounded-xl font-semibold shadow-lg shadow-cyan-500/20 transition duration-300"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;