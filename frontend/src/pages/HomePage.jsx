import React, { useContext } from 'react';
import { defiFeatures, features } from '../utils/data';
import DbankContext from '../components/DbankContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const {account, ConnectWallet} = useContext(DbankContext)

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <div className="relative h-[500px] rounded-lg mx-4 my-6 overflow-hidden">
        <img
          src="/dash.png"
          alt="Dash background"
          className="rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-white p-6">
          <h1 className="text-5xl font-bold mb-4">Welcome to Banking that works for Everyone, Everywhere.</h1>
          <p className="text-lg mb-8 text-center max-w-3xl">
            Share your decentralized finance journey! From seamless global transfers to staking rewards and financial growth, inspire others to take control of their finances with the power of DeFi!
          </p>
          <div className="w-full max-w-2xl relative">
            <input
              type="text"
              placeholder="Search for interest rates and products"
              className="w-full px-6 py-3 rounded-full text-black outline-none"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#04c052] text-black px-6 py-2 rounded-full">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Eco Creators Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12">Join the DeFi Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {defiFeatures.map((creator, index) => (
            <div key={index} className="rounded-lg overflow-hidden">
              <div className="h-48 relative">
                <img
                  src={creator.image}
                  alt={creator.title}
                  className="rounded-lg"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-lg">{creator.title}</h3>
                <p className="text-gray-600 dark:text-gray-500 mt-2">{creator.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-12">How Decentralized Banking Works</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-lg border border-gray-600 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/40
            hover:-translate-y-1 hover:bg-blue-900/10 transition-all duration-300">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-500 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold mb-8">Ready to join the DeFi-banking?</h2>
        <button 
          onClick={ConnectWallet} 
          className='bg-[#0583dd] hover:bg-[#0583dd]-500 font-semibold dark:text-white px-5 py-2 rounded-full text-md hover:bg-opacity-90' 
          > {account ? 'Connected' : 'Connect Wallet' }</button>
      </div>
    </div>
  )
}

export default HomePage