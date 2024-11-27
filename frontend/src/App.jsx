import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import NavBar from './components/NavigationBar';
import { ToastContainer } from "react-toastify";
import { DbankProvider } from './components/DbankContext';
import DepositPage from './pages/DepositPage';
import TransferPage from './pages/TransferPage';
import WidthDrawPage from './pages/WidthDrawPage';

function App() {

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
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/deposit" element={<DepositPage />} />
          <Route path="/transfer" element={<TransferPage />} />
          <Route path="/widthdraw" element={<WidthDrawPage />} />
        </Routes>
      </BrowserRouter>
    </DbankProvider>
  )
}

export default App
