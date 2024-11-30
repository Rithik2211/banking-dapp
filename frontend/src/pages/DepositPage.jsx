import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, TextField } from '@mui/material';
import { ethers } from "ethers";
import DbankContext from '../components/DbankContext';

const DepositPage = () => {
    const {contract, balance, account, setBalance} = useContext(DbankContext);
    const [name, setName] = useState();
    const [amount, setAmount] = useState();
    const [deposit, setDeposit]= useState();
    const [successfulltransaction, setsuccessfulltransaction] = useState();

    useEffect(()=>{
        const getAllDeposits = async() => {
            if(!contract){
                console.log("Connect Your Wallets!!");
            }
            else{
                try{
                    const allDeposits = await contract.getAllDeposits();
                    const parseDeposits = allDeposits.map((deposit) => ({
                        amount : ethers.formatEther(deposit.amount),
                        name : deposit.name,
                        depositTime: new Date(
                            Number(deposit.depositTime) * 1000
                        ).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                        }),
                    }))
                    console.log("parseDeposits :", parseDeposits)
                    setDeposit(parseDeposits);
                }
                catch(error){
                    console.log(error.message);
                }
            }
        }
        getAllDeposits();
    },[contract, balance, successfulltransaction])

    const DepositMoney = async() => {
        if(!contract){
            console.log("Connect Your Wallets!!");
        }
        else{
            try{
                if(name & amount){
                    const transactions = await contract.DepositMoney(name,{
                        value : ethers.parseEther(amount.toString()),
                    });
                    const response = await transactions.wait();
                    contract.on("Deposit Made", (account, amount, name)=> {
                        console.log(`Deposit Made of ${amount} from ${account} by ${name}`)
                    })
                    console.log("deposit made Successfully!");
                    const balance = await contract.checkBalance();
                    setBalance(ethers.formatEther(balance));
                    setsuccessfulltransaction((e)=> e+1);
                }
                else{
                    console.log("please enter both values");
                }
            }
            catch(error){
                let message = "An error occured during the transaction"
                if(error.reason){
                    message = error.reason;
                }
                else{
                    const matched = error.message.match(
                        /reverted with reason string '(.*)'/
                      );
                      if (matched) {
                        message = matched[1];
                      } else {
                        message = error.message
                      }
                }
                console.log(`Transaction failed: ${message} > deposit must be >0.01 eth`);
            }
        }
    }

    return (
        <div className="flex flex-col lg:flex-row md:flex-row">
          <div className="flex-1 p-6 border-b lg:border-r md:border-r border-gray-700 ">
            <Card classNae="h-full shadow-lg rounded-lg p-6" sx={{backgroundColor: "black"}}>
              <h2 className="text-2xl text-white font-bold mb-4">Deposit Funds</h2>
              <div className="space-y-10 text-white">
                <div className="bg-gray-500 p-4 rounded-lg">
                  <p className="font-medium">Available Balance</p>
                  <p className="text-3xl font-bold">{account ? balance ? `${Balance} Eth` : "Loading..." : '0.00 ETH'}</p>
                </div>
                <TextField
                    id="outlined-basic" 
                    label="Name" 
                    fullWidth
                    placeholder='Enter your Name'
                    sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'white' },
                          '&:hover fieldset': { borderColor: 'white' },
                        },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiOutlinedInput-input': { color: 'white' }
                    }}
                    onChange={(e)=>setName(e.target.value)}
                    value={name}
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
                    onChange={(e)=> setAmount(e.target.value)}
                    value={amount}
                />
                <Button fullWidth variant="contained" onClick={DepositMoney} > Deposit </Button>
              </div>
            </Card>
          </div>
          
          <div className="flex-1 p-6">
            <Card className="h-full shadow-lg rounded-lg p-6" sx={{backgroundColor: "black"}}>
              <h2 className="text-2xl font-bold mb-4 text-white">Deposit History</h2>
              <div className="space-y-4 text-white">
                { deposit?.length > 0 ? 
                deposit.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Withdrawal Request</p>
                        <p className="text-sm text-gray-500">{item.depositTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{item.amount} ETH</p>
                        <p className="text-sm text-green-600">Successfull</p>
                      </div>
                    </div>
                  </div>
                ))
                : 
                <div className="border border-gray-500 p-4">
                    <p className="font-medium">No Deposit History Found!</p>
                </div>
                }
            </div>
            </Card>
          </div>
        </div>
    );
}

export default DepositPage