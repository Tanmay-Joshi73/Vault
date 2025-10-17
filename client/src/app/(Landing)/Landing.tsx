'use client'
import React, { useState, useEffect } from 'react';
import { Shield, Lock, Key, Search, Copy, Edit, Trash2, Github, Mail, Check, Eye, EyeOff, Sun, Moon, Sparkles, Zap, Database, Users } from 'lucide-react';
import Footer from '../Components/Landing/Footer';
import Feature from '../Components/Landing/Feature';
import CTX from '../Components/Landing/CTX';
import HowItsWorks from '../Components/Landing/HowItsWorks';
export default function SecureVaultLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [passwordLength, setPasswordLength] = useState(16);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [vaultItems, setVaultItems] = useState([
    { id: 1, name: 'Gmail', username: 'user@email.com', password: '••••••••••••', visible: false, strength: 'Strong' },
    { id: 2, name: 'GitHub', username: 'developer', password: '••••••••••••', visible: false, strength: 'Strong' },
    { id: 3, name: 'AWS Console', username: 'admin', password: '••••••••••••', visible: false, strength: 'Very Strong' }
  ]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const generatePassword = () => {
    setIsGenerating(true);
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setTimeout(() => {
      setGeneratedPassword(password);
      setIsGenerating(false);
      setShowPassword(true);
    }, 800);
  };

  const copyToClipboard = (id: number | React.SetStateAction<null>) => {
   // @ts-ignore
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: "50K+", label: "Active Users" },
    { icon: <Lock className="w-6 h-6" />, value: "2M+", label: "Passwords Secured" },
    { icon: <Shield className="w-6 h-6" />, value: "100%", label: "Client-Side Encryption" },
    { icon: <Zap className="w-6 h-6" />, value: "99.9%", label: "Uptime" }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-900'
    }`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse ${
          darkMode ? 'bg-blue-500' : 'bg-blue-400'
        }`} style={{ animationDuration: '4s' }}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${
          darkMode ? 'bg-purple-500' : 'bg-purple-400'
        }`} style={{ animationDuration: '6s' }}></div>
        <div className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl opacity-10 animate-pulse ${
          darkMode ? 'bg-cyan-500' : 'bg-cyan-400'
        }`} style={{ animationDuration: '5s' }}></div>
      </div>

      {/* Header */}
      <header className={`fixed top-0 w-full backdrop-blur-md border-b z-50 transition-colors ${
        darkMode 
          ? 'bg-slate-900/80 border-slate-700' 
          : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Shield className="w-7 h-7 text-blue-600 animate-pulse" />
              <div className="absolute inset-0 bg-blue-500 blur-lg opacity-50"></div>
            </div>
            <span className="text-xl font-bold">SecureVault</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className={`transition-colors ${
              darkMode ? 'text-slate-300 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'
            }`}>Features</a>
            <a href="#how-it-works" className={`transition-colors ${
              darkMode ? 'text-slate-300 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'
            }`}>How It Works</a>
            <a href="#contact" className={`transition-colors ${
              darkMode ? 'text-slate-300 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'
            }`}>Contact</a>
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all ${
                darkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' 
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div 
            className="inline-block mb-6"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="relative">
              <div className={`absolute inset-0 blur-3xl opacity-40 rounded-full ${
                darkMode ? 'bg-blue-500' : 'bg-blue-400'
              }`}></div>
              <Shield className="w-24 h-24 text-blue-600 relative animate-float" />
            </div>
          </div>
          
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent ${
            darkMode 
              ? 'from-blue-400 via-purple-400 to-cyan-400' 
              : 'from-slate-900 via-blue-900 to-slate-900'
          }`}>
            SecureVault
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300">
              Generate, store, and manage passwords securely
            </p>
            <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
          </div>
          
          <p className={`mb-10 max-w-2xl mx-auto text-lg ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Your passwords deserve better protection. SecureVault uses client-side encryption to keep your credentials safe, private, and accessible only to you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105 hover:shadow-2xl shadow-lg flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              Get Started Free
            </button>
            <button className={`px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105 border-2 ${
              darkMode 
                ? 'border-slate-600 hover:border-blue-500 text-slate-300' 
                : 'border-slate-300 hover:border-blue-500 text-slate-700'
            }`}>
              View Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-xl backdrop-blur-sm border transition-all hover:scale-105 ${
                  darkMode 
                    ? 'bg-slate-800/50 border-slate-700 hover:border-blue-500' 
                    : 'bg-white/50 border-slate-200 hover:border-blue-400'
                }`}
              >
                <div className="text-blue-500 mb-2 flex justify-center">{stat.icon}</div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Feature darkMode={darkMode} />

      {/* How It Works Section - Interactive */}
      <HowItsWorks darkMode={darkMode} />

      {/* Testimonials Section */}
     

      {/* CTA Section */}
      <CTX darkMode={darkMode} />
     

      {/* Footer */}

      <footer id="contact" className={`py-12 px-6 ${
        darkMode ? 'bg-slate-950 text-slate-300' : 'bg-slate-900 text-slate-300'
      }`}>
        
        <Footer darkMode={darkMode}/>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes wiggle {
          0%, 100% {
            transform: rotate(-3deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out both;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(147, 51, 234, 0.4);
          transition: all 0.2s;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(147, 51, 234, 0.6);
        }

        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
          cursor: pointer;
          border-radius: 50%;
          border: none;
          box-shadow: 0 2px 8px rgba(147, 51, 234, 0.4);
          transition: all 0.2s;
        }

        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(147, 51, 234, 0.6);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#475569' : '#cbd5e1'};
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#64748b' : '#94a3b8'};
        }
      `}</style>
    </div>
  );
}