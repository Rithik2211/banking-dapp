import React, {useContext, useEffect, useState} from 'react';
import { Button, Card, TextField } from '@mui/material';
import { ethers } from "ethers";
import DbankContext from '../components/DbankContext';

const WithdrawPage = () => {
  const {contract, balance, account, setBalance} = useContext(DbankContext);

  const [allwithdraws, setAllwithdraws] = useState([]);
  const [WithdrawMade, setWithdrawMade] = useState();
  const [amount, setAmmount] = useState(0);
  
  useEffect(()=> {
    const getAllWithdrawals = async() => {
      if(!contract){
        console.log("Connect Your Wallets!!");
      }
      else{
        const withdrawals = await contract.getAllWithdrawals();
        const parsewithdraws = withdrawals.map((withdraw)=>({
          amount : ethers.formatEther(withdraw.amount),
          WithdrawTime : new Date(Number(withdraw.wthdrawTime * 1000
            ).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            }),
          )
        }));
        console.log("@parsewithdraws", parsewithdraws)
        setAllwithdraws(parsewithdraws);
      }
    }
    getAllWithdrawals();
  },[contract, WithdrawMade]);

  const RequestWidthdraw = async() =>{
    if(!contract){
      console.log("Connect Your Wallets!!");
    }
    else{
      try{
        const tx = await contract.requestWithdraw(
          ethers.parseEther(amount.toString)
        );
        const response = await tx.wait();
        console.log("response Request - Success !", response);
      }
      catch(err){
        let message = "An error occurred during the transaction.";
        if (error.reason) {
          message = error.reason;
        } else if (error.message) {
          const matched = error.message.match( /reverted with reason string '(.*)'/ );
          if (matched) {
            message = matched[1];
          } else {
            message = error.message;
          }
        }
        console.error(`Transaction failed - Request: ${message}`);
      }
    }
  }

  const ClaimWithdraw = async() => {
    if (!contract) {
      console.log("Connect Your Wallets!!");
    }
    else{
      try{
        const tx = await contract.claimWithdraw();
        const response = await tx.wait();
        console.log("response Claim - Success!", response);
        const balance = await contract.checkBalance();
        setBalance(ethers.formatEther(balance));
        setWithdrawMade((e) => e + 1);
      }
      catch(error){
        let message = "An error occurred during the transaction.";
        if (error.reason) {
          message = error.reason;
        } else if (error.message) {
          const matched = error.message.match( /reverted with reason string '(.*)'/ );
          if (matched) {
            message = matched[1];
          } else {
            message = error.message;
          }
        }
        console.error(`Transaction failed - Claim : ${message}`);
      }
    }
  }

  console.log("allwithdraws",allwithdraws)

  return (
    <div className="flex flex-col lg:flex-row md:flex-row">
      <div className="flex-1 p-6 border-b lg:border-r md:border-r border-gray-700 ">
        <Card className="h-full shadow-lg rounded-lg p-6" sx={{backgroundColor: "black"}}>
          <h2 className="text-2xl text-white font-bold mb-4">Withdraw Funds</h2>
          <div className="space-y-10 text-white">
            <div className="bg-gray-500 p-4 rounded-lg">
              <p className="font-medium">Available Balance</p>
              <p className="text-3xl font-bold">{account ? balance ? `${Balance} Eth` : "Loading..." : '0.00 ETH'}</p>
            </div>
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
            />
            <Button fullWidth variant="contained" onClick={RequestWidthdraw} > Withdraw </Button>
            <Button fullWidth variant="contained" color="success" onClick={ClaimWithdraw} > Claim Amount Widthdrawn </Button>
          </div>
        </Card>
      </div>
      
      <div className="flex-1 p-6">
        <Card className="h-full shadow-lg rounded-lg p-6" sx={{backgroundColor: "black"}}>
          <h2 className="text-2xl font-bold mb-4 text-white">Withdraw History</h2>
          <div className="space-y-4 text-white">
            { allwithdraws?.length > 0 ? 
            allwithdraws.map((withdraw, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Withdrawal Request</p>
                    <p className="text-sm text-gray-500">{withdraw.WithdrawTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{withdraw.amount} ETH</p>
                    <p className="text-sm text-green-600">Successfull</p>
                  </div>
                </div>
              </div>
            ))
            : 
            <div className="border border-gray-500 p-4">
                <p className="font-medium">No Withdrawal Request Found!</p>
            </div>
            }
        </div>
        </Card>
      </div>
    </div>
  );
};

export default WithdrawPage;