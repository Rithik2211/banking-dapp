import { Button, Card, TextField } from '@mui/material';
import React from 'react';
import { ethers } from "ethers";

const WithdrawPage = () => {
  return (
    <div className="h-[88vh] flex">
      <div className="flex-1 p-6 border-r border-gray-200 ">
        <Card className="h-full shadow-lg rounded-lg p-6" sx={{backgroundColor: "black"}}>
          <h2 className="text-2xl text-white font-bold mb-4">Withdraw Funds</h2>
          <div className="space-y-10 text-white">
            <div className="bg-gray-500 p-4 rounded-lg">
              <p className="font-medium">Available Balance</p>
              <p className="text-3xl font-bold">0.00 ETH</p>
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
            <Button fullWidth variant="contained" > Withdraw </Button>
            <Button fullWidth variant="contained" color="success" > Claim Amount Widthdrawn </Button>
          </div>
        </Card>
      </div>
      
      <div className="flex-1 p-6">
        <Card className="h-full shadow-lg rounded-lg p-6" sx={{backgroundColor: "black"}}>
          <h2 className="text-2xl font-bold mb-4 text-white">Withdraw History</h2>
          <div className="space-y-4 text-white">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Withdrawal Request</p>
                    <p className="text-sm text-gray-500">2024-03-27 10:00 AM</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">0.5 ETH</p>
                    <p className="text-sm text-yellow-600">Pending</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WithdrawPage;