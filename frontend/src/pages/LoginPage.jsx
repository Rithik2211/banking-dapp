import React, { useContext, useState } from 'react';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOkto } from "okto-sdk-react";
import { GoogleLogin } from "@react-oauth/google";
import DbankContext from '../components/DbankContext';
import { useSDK } from "@metamask/sdk-react";

const LoginPage = ({ setAuthToken, authToken, handleLogout }) => {
  const [email, setEmail] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [Account, setAccount] =  useState();
  let navigate = useNavigate();
  const { authenticate } = useOkto();
  const {account, ConnectWallet} = useContext(DbankContext);
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  const handleSignInWithEmail = () => {
    // Implement email sign in logic
    console.log('Sign in with email:', email);
  };
  const HandleNavigate = (route) => {
      ConnectWallet()
      navigate(route);
  }

  const connect = async () => {
    try {
        const accounts = await sdk?.connect();
        console.log("Metamask SDK:",accounts);
        setAccount(accounts?.[0]);
    } catch (err) {
        console.warn("failed to connect..", err);
    }
    };

  const handleGoogleLogin = async (credentialResponse) => {
    console.log("Google login response:", credentialResponse);
    const idToken = credentialResponse.credential;
    console.log("google idtoken: ", idToken);
    authenticate(idToken, async (authResponse, error) => {
      if (authResponse) {
        console.log("Authentication check: ", authResponse);
        setAuthToken(authResponse.auth_token);
        console.log("auth token received", authToken);
        navigate("/home");
      }
      if (error) {
        console.error("Authentication error:", error);
      }
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center flex-col p-6">
      <h1 className="text-4xl font-bold mb-4">Create an account</h1>
      <p className="mb-6 text-gray-600">Enter your email below to create your account</p>

      {/* Email Input */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>  setEmail(e.target.value)}
        className="w-full max-w-sm mb-3 px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Email Login Button */}
      <button
        onClick={handleSignInWithEmail}
        className="my-3 font-semibold px-4 py-2 max-w-sm w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
      >
        <Mail size={20} />
        Login with Email
      </button>

      {/* Google Login Button */}
      {/* <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={(error) => {
          console.log("Login Failed", error);
        }}
        useOneTap
        promptMomentNotification={(notification) =>
          console.log("Prompt moment notification:", notification)
        }
      /> */}
      {/* <button
        onClick={() => handleGoogleLogin()}
        className="my-3 font-semibold px-4 py-2 max-w-sm w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
      >
        <img src='/google.png' alt='google' className='w-6 h-6'/> Login with Google
      </button> */}

      {/* Divider */}
      <div className="flex items-center mb-3 w-full max-w-sm">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-4 text-gray-500 text-sm">OR CONTINUE WITH</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Wallet Button Placeholder */}
      <button 
        className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md"
        onClick={() => HandleNavigate('/home')}
        >
         Connect with Metamask
      </button>

      {/* Terms Checkbox */}
      <div className="flex items-center space-x-2 mt-3">
        <input
          type="checkbox"
          id="terms"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="terms" className="text-sm">
          Accept terms and conditions
        </label>
      </div>

      {/* Terms Text */}
      <div className="text-gray-500 mt-2 text-sm text-center">
        By clicking, you agree to our{' '}
        <a href="#" className="text-blue-500 hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-blue-500 hover:underline">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
};

export default LoginPage;