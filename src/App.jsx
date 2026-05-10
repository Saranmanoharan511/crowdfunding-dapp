import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Campaigns from "./pages/Campaigns";
import Dashboard from "./pages/Dashboard";
import CampaignDetails from "./pages/CampaignDetails";

function App(){
  return(
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Campaigns/>} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/campaign/:address" element={<CampaignDetails/>}/>
      </Routes>
    </Router>
  );
}






export default App
