import { Lock, Plus, Shield, Zap, Key, Sparkles } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface EmptyStateProps {
  onAddCredential: () => void;
}

export function EmptyState({ onAddCredential }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 opacity-50" />
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-pink-400/10 to-purple-400/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-6xl w-full space-y-12">
        {/* Main icon */}
        <div className="inline-flex relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-3xl opacity-40 animate-pulse" />
          <div className="relative rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-10 shadow-2xl shadow-indigo-500/50 ring-4 ring-white dark:ring-slate-900">
            <Lock className="h-20 w-20 text-white" />
          </div>
          <div className="absolute -top-3 -right-3">
            <Sparkles className="h-10 w-10 text-yellow-400 animate-pulse" />
          </div>
        </div>
        
        {/* Heading and description */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Vault is Empty
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Start your journey to <span className="font-semibold text-indigo-600 dark:text-indigo-400">ultimate security</span>. 
            Add your first credential and experience military-grade encryption that keeps your data safe.
          </p>
        </div>
        
        {/* CTA Button */}
        <div>
          <Button 
            onClick={onAddCredential} 
            size="lg" 
            className="gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 px-10 py-7 text-xl transition-all duration-300 hover:scale-105 group"
          >
            <Plus className="h-7 w-7 group-hover:rotate-90 transition-transform duration-300" />
            Add Your First Credential
          </Button>
        </div>
        
        {/* Feature cards */}
      
            
       
         
        
        {/* Additional info */}
      
      </div>
    </div>
  );
}