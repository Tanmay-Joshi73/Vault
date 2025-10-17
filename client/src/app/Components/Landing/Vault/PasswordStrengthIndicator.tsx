import { calculatePasswordStrength } from '@/src/app/lib/encryption';
import { Shield, AlertCircle, CheckCircle2, Lock } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const strengthConfig = {
  0: { 
    icon: AlertCircle, 
    gradient: 'from-red-500 to-rose-500',
    bgGradient: 'from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30',
    borderColor: 'border-red-200 dark:border-red-800',
    textColor: 'text-red-700 dark:text-red-400'
  },
  1: { 
    icon: AlertCircle, 
    gradient: 'from-orange-500 to-amber-500',
    bgGradient: 'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30',
    borderColor: 'border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-700 dark:text-orange-400'
  },
  2: { 
    icon: Shield, 
    gradient: 'from-yellow-500 to-amber-500',
    bgGradient: 'from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    textColor: 'text-yellow-700 dark:text-yellow-400'
  },
  3: { 
    icon: CheckCircle2, 
    gradient: 'from-lime-500 to-green-500',
    bgGradient: 'from-lime-50 to-green-50 dark:from-lime-950/30 dark:to-green-950/30',
    borderColor: 'border-lime-200 dark:border-lime-800',
    textColor: 'text-lime-700 dark:text-lime-400'
  },
  4: { 
    icon: Lock, 
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
    borderColor: 'border-green-200 dark:border-green-800',
    textColor: 'text-green-700 dark:text-green-400'
  },
};

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { score, label, color } = calculatePasswordStrength(password);
  const config = strengthConfig[score as keyof typeof strengthConfig];
  const Icon = config.icon;
  
  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Strength bars */}
      <div className="flex gap-1.5">
        {[0, 1, 2, 3, 4].map((index) => {
          const isActive = index <= score;
          const barConfig = strengthConfig[index as keyof typeof strengthConfig];
          
          return (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                isActive 
                  ? `bg-gradient-to-r ${barConfig.gradient} shadow-md` 
                  : 'bg-slate-200 dark:bg-slate-800'
              } ${isActive ? 'scale-105' : 'scale-100'}`}
              style={{
                transitionDelay: `${index * 50}ms`
              }}
            />
          );
        })}
      </div>
      
      {/* Strength label with icon */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 ${config.borderColor} bg-gradient-to-r ${config.bgGradient} transition-all duration-300`}>
        <div className={`p-1 rounded-md bg-gradient-to-br ${config.gradient} shadow-sm`}>
          <Icon className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="flex-1 flex items-center justify-between">
          <p className={`text-sm font-medium ${config.textColor}`}>
            Password strength: <span className="font-bold">{label}</span>
          </p>
          {score >= 3 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/20 text-green-700 dark:text-green-400">
              Secure
            </span>
          )}
        </div>
      </div>
      
      {/* Helpful tips for weak passwords */}
      {score < 3 && (
        <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 animate-in fade-in slide-in-from-top-1 duration-300">
          <p className="font-medium mb-1">💡 Tips to strengthen your password:</p>
          <ul className="space-y-0.5 ml-4 list-disc">
            {password.length < 12 && <li>Use at least 12 characters</li>}
            {!/[A-Z]/.test(password) && <li>Include uppercase letters</li>}
            {!/[a-z]/.test(password) && <li>Include lowercase letters</li>}
            {!/[0-9]/.test(password) && <li>Add numbers</li>}
            {!/[^A-Za-z0-9]/.test(password) && <li>Add special characters (!@#$%)</li>}
          </ul>
        </div>
      )}
    </div>
  );
}