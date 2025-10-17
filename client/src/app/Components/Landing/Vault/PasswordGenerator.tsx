import { useState } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Slider } from '@/src/components/ui/slider';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Label } from '@/src/components/ui/label';
import { generatePassword } from '@/src/app/lib/encryption';
import { toast } from 'sonner';
import { PasswordGeneratorOptions } from '@/src/app/Types/vault';

interface PasswordGeneratorProps {
  onPasswordGenerated: (password: string) => void;
}

export function PasswordGenerator({ onPasswordGenerated }: PasswordGeneratorProps) {
  const [options, setOptions] = useState<PasswordGeneratorOptions>({
    length: 16,
    includeLetters: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeLookalikes: true,
  });
  
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);
  
  const handleGenerate = () => {
    try {
      const password = generatePassword(options);
      console.log('Generated password is:', password);
      
      // Set the state first
      setGeneratedPassword(password);
      
      // Then call the callback with the password
      onPasswordGenerated(password);
      
      console.log("Password generator prop called with:", password);
      
    } catch (error) {
      toast.error('Please select at least one character type');
    }
  };
  
  const handleCopy = async () => {
    if (!generatedPassword) return;
    
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      toast.success('Password copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy password');
    }
  };

  // Also add an initial generation when component mounts
  useState(() => {
    handleGenerate();
  });
  
  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Password Generator</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={handleGenerate}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Generate
        </Button>
      </div>
      
      {generatedPassword && (
        <div className="flex items-center gap-2 rounded-md bg-muted p-3 font-mono text-sm">
          <span className="flex-1 break-all">{generatedPassword}</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className="shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Length: {options.length}</Label>
          </div>
          <Slider
            value={[options.length]}
            onValueChange={([value]) => setOptions({ ...options, length: value })}
            min={8}
            max={64}
            step={1}
            className="w-full"
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="letters"
              checked={options.includeLetters}
              onCheckedChange={(checked) => 
                setOptions({ ...options, includeLetters: checked as boolean })
              }
            />
            <Label htmlFor="letters" className="cursor-pointer">
              Include Letters (a-z, A-Z)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="numbers"
              checked={options.includeNumbers}
              onCheckedChange={(checked) => 
                setOptions({ ...options, includeNumbers: checked as boolean })
              }
            />
            <Label htmlFor="numbers" className="cursor-pointer">
              Include Numbers (0-9)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="symbols"
              checked={options.includeSymbols}
              onCheckedChange={(checked) => 
                setOptions({ ...options, includeSymbols: checked as boolean })
              }
            />
            <Label htmlFor="symbols" className="cursor-pointer">
              Include Symbols (!@#$%)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lookalikes"
              checked={options.excludeLookalikes}
              onCheckedChange={(checked) => 
                setOptions({ ...options, excludeLookalikes: checked as boolean })
              }
            />
            <Label htmlFor="lookalikes" className="cursor-pointer">
              Exclude look-alikes (0/O, 1/l)
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}