import React, { useContext } from 'react';
import DbankContext from './DbankContext';

export const navData = [
    { 
        label: 'Home',
        href: '/',
        style: 'text-white text-md',
        img : ''
    },
    { 
        label: 'Deposit',
        href: '/deposit',
        style: 'text-white text-md',
        img : ''
    },
    { 
        label: 'WidthDraw',
        href: '/widthdraw',
        style: 'text-white text-md',
        img : ''
    },
    { 
        label: 'Transfer',
        href: '/transfer',
        style: 'text-white text-md',
        img : ''
    },
]

const NavBar = () => {
    const {account, ConnectWallet} = useContext(DbankContext)

    const DisplayAccount = () => {
        return (
            <p className='text-sm'>Connected: {account.slice(0, 6)}.. {account.slice(-4)}</p>
        )
    }

  return (
    <div className='flex justify-center items-center sticky z-10 text-white font-[1rem] h-[55px] mt-[-20px] shadow-sm rounded-[30px]'>
      <div className='flex flex-row justify-between items-center z-1 w-full h-full'>
        <div className='text-white pl-5'>
           <h1 className='font-semibold text-xl'>Decentalized Banking</h1>
        </div>
        <div className="flex justify-around items-center w-[600px] h-[40px] flex-wrap mr-5">
            {
                navData.map((item, index) => (
                    <a key={index} href={item.href} className={item.style}>{item.label}</a>
                ))
            }
            <button onClick={ConnectWallet}
                className='bg-[#0583dd] hover:bg-[#0583dd]-500 font-semibold text-white px-4 py-2 rounded-full text-md hover:bg-opacity-90 flex flex-row gap-2' > 
                <img src='/metamask.svg' alt='metamask' className='w-6 h-6'/>{account ? `${account.slice(0, 6)}.. ${account.slice(-4)}` : "Connect Wallet" }
            </button>
        </div>
      </div>
    </div>
  )
}

export default NavBar;