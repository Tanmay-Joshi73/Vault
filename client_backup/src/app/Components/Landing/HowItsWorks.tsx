'use client'
import { Shield,Eye,EyeOff,Database,Sparkles,Lock,Check,Key,Zap,Search,Edit,Trash2,Copy } from "lucide-react"
interface HowitsProps{
    darkMode:Boolean
}
import { useState } from "react";
export default function HowItsWorks({darkMode}:HowitsProps){
     const [activeStep, setActiveStep] = useState(0);
      const [passwordLength, setPasswordLength] = useState(16);
      const [generatedPassword, setGeneratedPassword] = useState('');
      const [isGenerating, setIsGenerating] = useState(false);
      const [showPassword, setShowPassword] = useState(false);
      const [includeUppercase, setIncludeUppercase] = useState(true);
      const [includeNumbers, setIncludeNumbers] = useState(true);
      const [includeSymbols, setIncludeSymbols] = useState(true);
      const [copiedId, setCopiedId] = useState<number | null >(null);
      const [vaultItems, setVaultItems] = useState([
          { id: 1, name: 'Gmail', username: 'user@email.com', password: '••••••••••••', visible: false, strength: 'Strong' },
          { id: 2, name: 'GitHub', username: 'developer', password: '••••••••••••', visible: false, strength: 'Strong' },
          { id: 3, name: 'AWS Console', username: 'admin', password: '••••••••••••', visible: false, strength: 'Very Strong' }
        ]);

        
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



  const copyToClipboard = (id: number ) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };




    return(
<section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              See SecureVault in action with live interactive demos
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Steps Navigation */}
            <div className="space-y-6">
              <div 
                onClick={() => setActiveStep(0)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all hover:-translate-y-1 ${
                  activeStep === 0 
                    ? darkMode 
                      ? 'border-blue-500 bg-blue-500/10 shadow-2xl shadow-blue-500/20' 
                      : 'border-blue-500 bg-blue-50 shadow-2xl shadow-blue-500/20'
                    : darkMode
                      ? 'border-slate-700 bg-slate-800/50 hover:border-blue-500/50'
                      : 'border-slate-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg transition-all ${
                    activeStep === 0 
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg' 
                      : darkMode 
                        ? 'bg-slate-700 text-slate-300' 
                        : 'bg-slate-200 text-slate-600'
                  }`}>
                    01
                  </div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    Sign Up & Log In
                    {activeStep === 0 && <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />}
                  </h3>
                </div>
                <p className={`ml-18 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Create your account with a strong master password. This is the only password you'll need to remember.
                </p>
              </div>

              <div 
                onClick={() => setActiveStep(1)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all hover:-translate-y-1 ${
                  activeStep === 1 
                    ? darkMode 
                      ? 'border-purple-500 bg-purple-500/10 shadow-2xl shadow-purple-500/20' 
                      : 'border-purple-500 bg-purple-50 shadow-2xl shadow-purple-500/20'
                    : darkMode
                      ? 'border-slate-700 bg-slate-800/50 hover:border-purple-500/50'
                      : 'border-slate-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg transition-all ${
                    activeStep === 1 
                      ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg' 
                      : darkMode 
                        ? 'bg-slate-700 text-slate-300' 
                        : 'bg-slate-200 text-slate-600'
                  }`}>
                    02
                  </div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    Generate & Save Passwords
                    {activeStep === 1 && <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />}
                  </h3>
                </div>
                <p className={`ml-18 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Use our advanced generator to create ultra-secure passwords with custom length and character options.
                </p>
              </div>

              <div 
                onClick={() => setActiveStep(2)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all hover:-translate-y-1 ${
                  activeStep === 2 
                    ? darkMode 
                      ? 'border-green-500 bg-green-500/10 shadow-2xl shadow-green-500/20' 
                      : 'border-green-500 bg-green-50 shadow-2xl shadow-green-500/20'
                    : darkMode
                      ? 'border-slate-700 bg-slate-800/50 hover:border-green-500/50'
                      : 'border-slate-200 bg-white hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg transition-all ${
                    activeStep === 2 
                      ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg' 
                      : darkMode 
                        ? 'bg-slate-700 text-slate-300' 
                        : 'bg-slate-200 text-slate-600'
                  }`}>
                    03
                  </div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    Manage Your Vault
                    {activeStep === 2 && <Sparkles className="w-5 h-5 text-green-500 animate-pulse" />}
                  </h3>
                </div>
                <p className={`ml-18 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Access, search, copy, edit, and organize all your passwords in one secure, encrypted vault.
                </p>
              </div>
            </div>

            {/* Interactive Demo */}
            <div className={`rounded-3xl border-2 p-8 shadow-2xl backdrop-blur-sm sticky top-24 ${
              darkMode 
                ? 'bg-slate-800/80 border-slate-700' 
                : 'bg-white/80 border-slate-200'
            }`}>
              {/* Step 1: Sign Up */}
              {activeStep === 0 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 ${
                      darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                    }`}>
                      <Lock className="w-10 h-10 text-blue-600 animate-wiggle" />
                    </div>
                    <h4 className="text-3xl font-bold mb-2">Create Account</h4>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Your journey to better security starts here
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>Email Address</label>
                      <input 
                        type="email" 
                        placeholder="you@example.com"
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all ${
                          darkMode 
                            ? 'bg-slate-700/50 border-slate-600 focus:border-blue-500 focus:ring-blue-500/20 text-white' 
                            : 'bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
                        }`}
                        defaultValue="user@example.com"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>Master Password</label>
                      <div className="relative">
                        <input 
                          type="password" 
                          placeholder="Create a strong master password"
                          className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all ${
                            darkMode 
                              ? 'bg-slate-700/50 border-slate-600 focus:border-blue-500 focus:ring-blue-500/20 text-white' 
                              : 'bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
                          }`}
                          defaultValue="••••••••••••"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-500 font-medium">Strong</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2">
                      <Check className="w-5 h-5" />
                      Create Account
                    </button>
                  </div>
                  
                  <div className={`p-4 rounded-xl border-2 ${
                    darkMode 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-green-50 border-green-200'
                  }`}>
                    <p className={`text-sm flex items-center gap-2 ${
                      darkMode ? 'text-green-400' : 'text-green-800'
                    }`}>
                      <Shield className="w-4 h-4" />
                      Your master password is never stored on our servers
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Password Generator */}
              {activeStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 ${
                      darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                    }`}>
                      <Key className="w-10 h-10 text-purple-600 animate-wiggle" />
                    </div>
                    <h4 className="text-3xl font-bold mb-2">Password Generator</h4>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Create unbreakable passwords instantly
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className={`text-sm font-medium ${
                        darkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Password Length
                      </label>
                      <span className="text-2xl font-bold text-purple-600">{passwordLength}</span>
                    </div>
                    <input 
                      type="range" 
                      min="8" 
                      max="32" 
                      value={passwordLength}
                      onChange={(e) => setPasswordLength(Number(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-purple-200 to-purple-400 rounded-full appearance-none cursor-pointer slider"
                    />
                  </div>

                  <div className={`space-y-3 p-4 rounded-xl ${
                    darkMode ? 'bg-slate-700/30' : 'bg-slate-50'
                  }`}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={includeUppercase}
                        onChange={(e) => setIncludeUppercase(e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded"
                      />
                      <span className={`text-sm group-hover:text-purple-600 transition-colors ${
                        darkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>Include Uppercase Letters (A-Z)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={includeNumbers}
                        onChange={(e) => setIncludeNumbers(e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded"
                      />
                      <span className={`text-sm group-hover:text-purple-600 transition-colors ${
                        darkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>Include Numbers (0-9)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={includeSymbols}
                        onChange={(e) => setIncludeSymbols(e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded"
                      />
                      <span className={`text-sm group-hover:text-purple-600 transition-colors ${
                        darkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>Include Symbols (!@#$%^&*)</span>
                    </label>
                  </div>

                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={generatedPassword || 'Click generate to create password'}
                      readOnly
                      className={`w-full px-4 py-4 pr-12 rounded-xl border-2 font-mono text-sm transition-all ${
                        darkMode 
                          ? 'bg-slate-700/50 border-slate-600 text-white' 
                          : 'bg-slate-50 border-slate-300'
                      } ${generatedPassword ? 'text-green-600' : ''}`}
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                        darkMode 
                          ? 'text-slate-400 hover:text-purple-400 hover:bg-slate-700' 
                          : 'text-slate-500 hover:text-purple-600 hover:bg-slate-200'
                      }`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <button 
                    onClick={generatePassword}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Generate Strong Password
                      </>
                    )}
                  </button>

                  {generatedPassword && (
                    <div className={`p-4 rounded-xl border-2 animate-slideIn ${
                      darkMode 
                        ? 'bg-purple-500/10 border-purple-500/30' 
                        : 'bg-purple-50 border-purple-200'
                    }`}>
                      <p className={`text-sm flex items-center gap-2 ${
                        darkMode ? 'text-purple-400' : 'text-purple-800'
                      }`}>
                        <Check className="w-4 h-4" />
                        Strong password generated! Save it to your vault.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Vault Management */}
              {activeStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 ${
                      darkMode ? 'bg-green-500/20' : 'bg-green-100'
                    }`}>
                      <Database className="w-10 h-10 text-green-600 animate-wiggle" />
                    </div>
                    <h4 className="text-3xl font-bold mb-2">Your Vault</h4>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      All your passwords, encrypted and organized
                    </p>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Search passwords..."
                      className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all ${
                        darkMode 
                          ? 'bg-slate-700/50 border-slate-600 focus:border-green-500 focus:ring-green-500/20 text-white placeholder-slate-400' 
                          : 'bg-white border-slate-300 focus:border-green-500 focus:ring-green-500/20'
                      }`}
                    />
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                    {vaultItems.map((item, idx) => (
                      <div 
                        key={item.id}
                        className={`p-5 rounded-xl border-2 transition-all hover:-translate-y-1 hover:shadow-lg animate-slideIn ${
                          darkMode 
                            ? 'bg-slate-700/50 border-slate-600 hover:border-green-500' 
                            : 'bg-white border-slate-200 hover:border-green-400'
                        }`}
                        style={{
                          animationDelay: `${idx * 0.1}s`
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-semibold text-lg">{item.name}</h5>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                item.strength === 'Very Strong' 
                                  ? 'bg-green-500/20 text-green-500' 
                                  : 'bg-blue-500/20 text-blue-500'
                              }`}>
                                {item.strength}
                              </span>
                            </div>
                            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              {item.username}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => copyToClipboard(item.id)}
                              className={`p-2 rounded-lg transition-all hover:scale-110 ${
                                copiedId === item.id 
                                  ? 'bg-green-500 text-white' 
                                  : darkMode 
                                    ? 'hover:bg-slate-600 text-slate-400' 
                                    : 'hover:bg-blue-50 text-slate-600'
                              }`}
                            >
                              {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button className={`p-2 rounded-lg transition-all hover:scale-110 ${
                              darkMode ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-blue-50 text-slate-600'
                            }`}>
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className={`p-2 rounded-lg transition-all hover:scale-110 ${
                              darkMode ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'
                            }`}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className={`flex items-center gap-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          <Lock className="w-3 h-3" />
                          <span className="text-xs font-mono">{item.password}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full border-2 border-dashed py-4 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 text-green-600 border-green-600 hover:bg-green-500/10">
                    <Key className="w-5 h-5" />
                    Add New Password
                  </button>

                  <div className={`p-4 rounded-xl border-2 ${
                    darkMode 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-green-50 border-green-200'
                  }`}>
                    <p className={`text-sm flex items-center gap-2 ${
                      darkMode ? 'text-green-400' : 'text-green-800'
                    }`}>
                      <Shield className="w-4 h-4" />
                      All passwords are encrypted with AES-256
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
}