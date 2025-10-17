import { Key,Lock,Edit,Shield } from "lucide-react";
interface FeatureProps{
    darkMode:Boolean
}

const features = [
    {
      icon: <Key className="w-8 h-8" />,
      title: "Strong Password Generator",
      description: "Customize length with an intuitive slider. Choose from letters, numbers, and symbols to create unbreakable passwords.",
      color: "blue"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Encrypted Vault",
      description: "Your passwords are encrypted on your device before storage. We never see your plaintext data.",
      color: "purple"
    },
    {
      icon: <Edit className="w-8 h-8" />,
      title: "Manage Easily",
      description: "Add, edit, delete, search, and copy passwords with a clean interface designed for simplicity.",
      color: "green"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy-First",
      description: "Zero-knowledge architecture ensures the server never stores plaintext passwords. Your data stays yours.",
      color: "red"
    }
  ];

export default function Feature({darkMode}:FeatureProps){
    return(
<section id="features" className={`py-20 px-6 ${darkMode ? 'bg-slate-900/50' : 'bg-white/50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Powerful features designed with simplicity and privacy in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-8 rounded-2xl border-2 transition-all group cursor-pointer hover:-translate-y-2 ${
                  darkMode 
                    ? 'bg-slate-800/50 border-slate-700 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20' 
                    : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/20'
                }`}
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 transition-all group-hover:scale-110 ${
                  feature.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                  feature.color === 'purple' ? 'bg-purple-500/10 text-purple-500' :
                  feature.color === 'green' ? 'bg-green-500/10 text-green-500' :
                  'bg-red-500/10 text-red-500'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className={`leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
}