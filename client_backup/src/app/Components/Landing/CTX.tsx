'use client'
import { Sparkles,Shield,Zap } from "lucide-react"
import { useRouter } from "next/navigation"
interface CtxProps{
    darkMode:Boolean
}

export default function CTX({darkMode}:CtxProps){
  const router=useRouter();
    return(
<section className={`py-20 px-6 ${
        darkMode 
          ? 'bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900' 
          : 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            <Shield className="w-12 h-12 text-white animate-float" />
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Ready to Secure Your Passwords?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of users protecting their digital lives with SecureVault
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 hover:shadow-2xl shadow-lg flex items-center justify-center gap-2" 
            onClick={()=>{
              router.push('/Login')
              // router.push('/Vault')
            }}>
              <Zap className="w-5 h-5" />
              Create Free Account
            </button>
            <button className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105">
              View Pricing
            </button>
          </div>
        </div>
      </section>
    )}