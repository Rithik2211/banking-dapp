import React, { createContext, useState } from 'react'
import { ethers } from 'ethers';
import abi from '../contracts/abi.json';
import { useSDK } from "@metamask/sdk-react";

const DbankContext = createContext();

export const DbankProvider = ({children}) => {
    const [balance, setBalance] = useState(0);
    const [contract, setContract] = useState();
    const [account, setAccount] = useState();
    const { sdk, connected, connecting, provider, chainId } = useSDK();

    const verifyContractABI = (abi) => {
        // Check if getAlltransfers exists in the ABI
        const getAllTransfersFunction = abi.find(
            item => item.type === 'function' && 
            item.name === 'getAlltransfers'
        );
    
        if (!getAllTransfersFunction) {
            console.error("getAlltransfers function not found in ABI!");
            console.log("Available functions:", abi.filter(
                item => item.type === 'function'
            ).map(f => f.name));
            return false;
        }
    
        console.log("getAlltransfers function found:", getAllTransfersFunction);
        return true;
    };

    const ConnectWallet = async() => {
        if (!window.ethereum) {
            alert("MetaMask not installed. Please install MetaMask to use this feature.");
            return;
        }
        else{
            try{
                const accounts = await sdk?.connect();
                console.log("Metamask SDK:",accounts?.[0]);
                setAccount(accounts?.[0]);
                const web3Provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await web3Provider.getSigner();
                // 0xBbC8C1ce49F8181463870521deF055535FE9eD1d
                const contractAddress = "0xBbC8C1ce49F8181463870521deF055535FE9eD1d"
                console.log("Attempting to connect to contract at:", contractAddress);
                if (!ethers.isAddress(contractAddress)) {
                    throw new Error("Invalid contract address format");
                }
                // const code = await web3Provider.getCode(contractAddress);
                // console.log("Code at address:", code);
                
                // if (code === '0x' || code === '0x0') {
                //     throw new Error(`No contract found at address ${contractAddress}. Make sure the contract is deployed and you're on the correct network.`);
                // }
                const contract = new ethers.Contract(
                    contractAddress,
                    abi,
                    signer
                );
                
                console.log("Contract instance:", contract);
                console.log("verifyContractABI(abi)", verifyContractABI(abi));

                if (contract) {
                    console.log("Contract methods:", contract.interface.fragments);

                    try {
                        if (!contract.interface.getFunction('getAlltransfers')) {
                            throw new Error('getAlltransfers function not found in contract ABI');
                        }
            
                        const transfers = await contract.getAlltransfers();
                        console.log("Transfers:", transfers);
            
                    } catch (error) {
                        console.error("Error details:", {
                            message: error.message,
                            code: error.code,
                            data: error.data,
                            transaction: error.transaction
                        });
            
                        // Try alternative call with explicit gas limit if needed
                        try {
                            const balance = await contract.checkBalance();
                            setBalance(ethers.formatEther(balance));
                            console.log("Balance of the contract:", balance);
                        } catch (altError) {
                            console.error("Alternative call failed:", altError);
                        }
                    }
                    setContract(contract);
                }
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