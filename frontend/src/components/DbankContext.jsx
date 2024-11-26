import React, { createContext, useState } from 'react'
import { ethers } from 'ethers';
import abi from '../contracts/abi.json';
import { toast } from "react-toastify";

const DbankContext = createContext();

export const DbankProvider = ({children}) => {
    const [balance, setBalance] = useState(0);
    const [contract, setContract] = useState();
    const [account, setAccount] = useState();

    const ConnectWallet = async() => {
        if(!window.ethereum){
            toast.warning("MetaMask not installed");
        }
        else{
            try{
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                toast.success(`Connected: ${Address}`);

                setAccount(address)
                const contract = new ethers.Contract(
                    '0xea09f7d49De7159142E2DC5a491a11241b76CbB2',
                    abi,
                    provider
                )
                const balance = await contract.checkBalance();
                setBalance(ethers.formatEther(balance))
                setContract(contract)
            }
            catch(err){
                console.error(err.message);
            }
        }
    }

    const value = {
        contract,
        balance,
        account,
        ConnectWallet,
        setBalance,
    }

  return (
    <DbankContext.Provider value={value}>{children}</DbankContext.Provider>
  )
}

export default DbankContext;