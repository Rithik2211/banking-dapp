import { Button, Card, TextField } from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import { ethers } from "ethers";
import DbankContext from '../components/DbankContext';

const TransferPage = () => {
  const {contract, balance, account, setBalance} = useContext(DbankContext);
  const [amount, setAmount] = useState(0);
  const [allTransfers, setAllTransfers] = useState([]);
  const [transactionMade, setTransactionMade] = useState();
  const [receiver, setReceiver] = useState();

  useEffect(()=> {
    const getAllTransfers = async() => {
      if(!contract){
        console.log("Connect Your Wallets!!");
      }
      else{
        const transfers = await contract.getAlltransfers();
        const parseTransfers = transfers.map((transfer)=>({
          amount : ethers.formatEther(transfer.amount),
          receiver: transfer.receiver,
          depositTime : new Date(Number(transfer.depositTime * 1000).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),)
        }));
        console.log("parseTransfers : ",parseTransfers);
        setAllTransfers(parseTransfers);
      }
    }
    getAllTransfers();
  },[contract, transactionMade]);

  const TransferAmount = async() => {
    if(!contract){
      console.log("Connect Your Wallets!!");
    }
    else{
      try{
        const tx = await contract.TransferMoney(ethers.parseEther(amount.toString()), receiver);
        const response = await tx.wait();
        console.log("response Transfer - Success!", response);
        setTransactionMade((e) => e + 1);
        const balance = await contract.checkBalance();
        setBalance(ethers.formatEther(balance));
      }
      catch(error){
        let message = "An error occurred during the transaction.";
        if (error.reason) {
          message = error.reason;
        } else if (error.message) {
          const matched = error.message.match(
            /reverted with reason string '(.*)'/
          );
          if (matched) {
            message = matched[1];
          } else {
            message = error.message;
          }
        }
        console.error(`Transaction failed - Transfer : ${message}`);
      }
    }
  }


  return (
    <div className="flex md:h-[88vh] flex-col lg:flex-row md:flex-row">
      <div className="flex-1 p-6 border-b md:border-r border-gray-700 ">
        <Card className="h-full shadow-lg rounded-lg p-6" sx={{backgroundColor: "black"}}>
          <h2 className="text-2xl text-white font-bold mb-4">Transfer Funds</h2>
          <div className="space-y-10 text-white">
            <div className="bg-gray-500 p-4 rounded-lg">
              <p className="font-medium">Available Balance</p>
              <p className="text-3xl font-bold">{account ? balance ? `${Balance} Eth` : "Loading..." : '0.00 ETH'}</p>
            </div>
            <TextField 
              id="outlined-basic" 
              label="Transfer Address" 
              fullWidth
              placeholder='Enter Address to Transfer'
              sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white' },
                    '&:hover fieldset': { borderColor: 'white' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-input': { color: 'white' }
                }}
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
            />
            <TextField 
                id="outlined-basic" 
                label="Amount" 
                fullWidth
                placeholder='Enter Amount in Ethers'
                sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'white' },
                      '&:hover fieldset': { borderColor: 'white' },
                    },
                    '& .MuiInputLabel-root': { color: 'white' },
                    '& .MuiOutlinedInput-input': { color: 'white' }
                  }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <Button fullWidth variant="contained" color="secondary" onClick={() => TransferAmount()} > Transfer </Button>
          </div>
        </Card>
      </div>
      
      <div className="flex-1 p-6">
        <Card className="h-full shadow-lg rounded-lg p-6" sx={{backgroundColor: "black"}}>
          <h2 className="text-2xl font-bold mb-4 text-white">Transfer History</h2>
          <div className="space-y-4 text-white">
            { allTransfers?.length > 0 ? 
            allTransfers.map((transfer, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Withdrawal Request</p>
                    <p className="text-sm text-gray-500">{transfer.transferTime}</p>
                  </div>
                  <div className="text justify-between flex" title={transfer.receiver} >
                    <span className="font-semibold">To</span>
                    {transfer.receiver.slice( 0, transfer.receiver.length / 2 )}
                    ...
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{transfer.amount} ETH</p>
                    <p className="text-sm text-green-600">Successfull</p>
                  </div>
                </div>
              </div>
            ))
            : 
            <div className="border border-gray-500 p-4">
                <p className="font-medium">No Transfer History Found!</p>
            </div>
            }
        </div>
        </Card>
      </div>
    </div>
  );
}

export default TransferPage