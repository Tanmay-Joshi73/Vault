import { Shield,Github,Mail ,Key,Lock,Edit} from "lucide-react"
interface Footerprop{
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


export default function Footer({darkMode}:Footerprop){
    return(
<div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-bold text-white">SecureVault</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Privacy-first password management for everyone.
              </p>
              <div className="flex gap-3">
                <a href="https://github.com" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="mailto:contact@securevault.com" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-blue-400 transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#blog" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="#careers" className="hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#security" className="hover:text-blue-400 transition-colors">Security</a></li>
                <li><a href="#compliance" className="hover:text-blue-400 transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className={`border-t pt-8 text-center text-sm ${
            darkMode ? 'border-slate-800' : 'border-slate-800'
          }`}>
            <p className="text-slate-500">&copy; 2025 SecureVault. All rights reserved. Your privacy is our priority.</p>
          </div>
        </div>
        )
    }