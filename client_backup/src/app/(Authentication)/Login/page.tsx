'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import useMasterKeyStore from '../../lib/Store/MasterKeyContext';
// import encryptPassword, { createMasterKey, FormData } from '@/app/lib/AuthEncryption';
import { createMasterKey,FormData } from '../../lib/AuthEncryption';
import { StoredUserId } from '../../lib/Store/MasterKeyContext';

import hashPassword from '../../lib/AuthEncryption';
// const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const baseUrl='http://localhost:5000'
  // const baseUrl='http://34.133.10.15:5000/';
// console.log(baseUrl);
;

export default function AuthPage() {
  const router=useRouter()
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const {setMasterKey}=useMasterKeyStore()
  const {setuserid}=StoredUserId()
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setMasterPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
    setValidationError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const validateForm = () => {
    setValidationError('');
    
    if (!email || !masterPassword) {
      setValidationError('Email and password are required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }

    if (masterPassword.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return false;
    }

    if (isSignUp && !confirmPassword) {
      setValidationError('Please confirm your password');
      return false;
    }

    if (isSignUp && masterPassword !== confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Encrypt password
      const encryptedData = await hashPassword(masterPassword,email);
      const EncryptedPass=encryptedData.hash;
      
      

      const formData: FormData = {
        email,
        masterPassword: EncryptedPass,
      };

      const endpoint = isSignUp ? `${baseUrl}/auth/SignUp` : `${baseUrl}/auth/Login`;

      const { data } = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "application/json" },
      });
      
      // Handle server response based on Status
      if (!data.Status) {
        setError(data.Message || 'An error occurred.');
        setSuccess(false);
        return;
      }

      // If Status is true, show success
      console.log(data);
      
      
      setSuccess(true);
      setError('');
      setEmail('');
      setMasterPassword('');
      setConfirmPassword('');

      console.log(data.Message); // Optional: debug
  
 if(data.Status){
  const masterKey = await createMasterKey(EncryptedPass, encryptedData.salt);
  const id=email;
  setuserid(id);
  ///setting the master key in the context
  setMasterKey(masterKey)
  // Use master key for encrypting vault data
}
      if (!isSignUp) {
        console.log("Login successful:", data);
        // Redirect or store token here
        router.push('/Vault')
        
      }

    } catch (err: any) {
      console.error("Error:", err);
      setError(err.response?.data?.message || err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-slate-400">
              {isSignUp ? 'Sign up for your secure vault' : 'Sign in to access your vault'}
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-400 font-medium">
                  {isSignUp ? 'Account created successfully!' : 'Login successful!'}
                </p>
                <p className="text-green-300/80 text-sm mt-1">
                  {isSignUp ? 'You can now log in with your credentials.' : 'Redirecting to dashboard...'}
                </p>
              </div>
            </div>
          )}

          {(error || validationError) && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error || validationError}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="masterPassword" className="block text-sm font-medium text-slate-300 mb-2">
                Master Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="masterPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  placeholder="Enter your master password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    placeholder="Confirm your master password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-blue-400 hover:text-blue-300 transition"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
                </>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-400 hover:text-blue-300 font-medium transition"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-xs">
            {isSignUp 
              ? 'Your master password is encrypted and cannot be recovered. Make sure to remember it.'
              : 'Your data is encrypted and secure.'}
          </p>
        </div>
      </div>
    </div>
  );
}
