import React, { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavBar from './components/NavigationBar';
import { ToastContainer } from "react-toastify";
import { DbankProvider } from './components/DbankContext';
import DepositPage from './pages/DepositPage';
import TransferPage from './pages/TransferPage';
import WidthDrawPage from './pages/WidthDrawPage';
import LoginPage from './pages/LoginPage';
import { OktoProvider, BuildType } from 'okto-sdk-react';

const OKTO_CLIENT_API_KEY = import.meta.env.REACT_APP_OKTO_CLIENT_API_KEY;
function App() {
  const [authToken, setAuthToken] = useState(null);
  const handleLogout = () => {
      console.log("setting auth token to null")
      setAuthToken(null);
  };

  return (
    <DbankProvider>
      <BrowserRouter>
      <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          className="w-full sm:w-96 md:w-80 lg:w-96 xl:w-1/4 font-sans"
        />
       <OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX}>
          <NavBar authToken={authToken} handleLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<LoginPage setAuthToken={setAuthToken} authToken={authToken} handleLogout={handleLogout}/>} />
            <Route path="/home" element={ <HomePage />} />
            <Route path="/deposit" element={ <DepositPage />} />
            <Route path="/transfer" element={ <TransferPage />} />
            <Route path="/widthdraw" element={ <WidthDrawPage />} />
          </Routes>
        </OktoProvider>
      </BrowserRouter>
    </DbankProvider>
  )
}

export default App
