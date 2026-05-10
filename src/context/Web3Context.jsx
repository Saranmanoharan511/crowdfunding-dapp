import { createContext, useState, useEffect } from "react";
import {ethers} from "ethers";

export const Web3Context=createContext();

export const Web3Provider=({children})=>{
    const [account,setaccount]=useState(null);
    const [provider,setprovider]=useState(null);
    const [signer,setsigner]=useState(null);

    const connectWallet=async ()=>
    {
        if(!window.ethereum)
        {
            alert("Install Metamask")
            return;
        }

        const prov=new ethers.BrowserProvider(window.ethereum);
        const accounts=await prov.send("eth_requestAccounts",[]);
        const signer=await prov.getSigner();

        setaccount(accounts[0]);
        setprovider(prov);
        setsigner(signer);

    };

    return(
        <Web3Context.Provider value={{account,provider,signer,connectWallet}}>
          {children}
        </Web3Context.Provider>
    );


};