import { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, Globe, Mail, FolderOpen, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { PasswordGenerator } from './PasswordGenerator';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { toast } from 'sonner';
import { Credential } from '@/src/app/Types/vault';
import { StoredUserId } from '@/src/app/lib/Store/MasterKeyContext';

interface AddCredentialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (credential: Credential) => void;
  editingCredential?: Credential;
  decryptedPassword?: string;
}

interface FormErrors {
  website?: string;
  username?: string;
  password?: string;
}

export function AddCredentialDialog({ 
  open, 
  onOpenChange, 
  onSave,
  editingCredential,
  decryptedPassword 
}: AddCredentialDialogProps) {
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [folder, setFolder] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const Storeduserdata = StoredUserId();
  const useremail = Storeduserdata.Email;

  // Reset form when dialog opens/closes or editing credential changes
  useEffect(() => {
    if (open) {
      if (editingCredential) {
        setWebsite(editingCredential.website);
        setUsername(editingCredential.username);
        setPassword(decryptedPassword || '');
        setFolder(editingCredential.folder || '');
      } else {
        setWebsite('');
        setUsername('');
        setPassword('');
        setFolder('');
      }
      setShowPassword(false);
      setErrors({});
      setTouched({});
    }
  }, [editingCredential, decryptedPassword, open]);
  
  // Validation logic
  const validateField = useCallback((field: string, value: string): string | undefined => {
    switch (field) {
      case 'website':
        if (!value.trim()) return 'Website is required';
        if (value.trim().length < 3) return 'Website must be at least 3 characters';
        return undefined;
      case 'username':
        if (!value.trim()) return 'Username is required';
        if (value.trim().length < 3) return 'Username must be at least 3 characters';
        return undefined;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return undefined;
      default:
        return undefined;
    }
  }, []);
  
  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {
      website: validateField('website', website),
      username: validateField('username', username),
      password: validateField('password', password),
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  }, [website, username, password, validateField]);
  
  // Handle field blur for validation
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, 
      field === 'website' ? website : 
      field === 'username' ? username : 
      password
    );
    setErrors(prev => ({ ...prev, [field]: error }));
  };
  
  const handleSave = async () => {
    // Mark all fields as touched
    setTouched({ website: true, username: true, password: true });
    
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create credential with PLAIN TEXT password
      // The Vault component will handle the encryption
      const credential: Credential = {
        id: editingCredential?.id || crypto.randomUUID(),
        website: website.trim(),
        username: username.trim(),
        password: password, // Send plain text password
        url: website.trim().startsWith('http') ? website.trim() : `https://${website.trim()}`,
        folder: folder.trim() || undefined,
        notes: '', // Add notes field if needed
        createdAt: editingCredential?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        email: useremail
      };
      
      console.log('Sending credential to parent:', {
        ...credential,
        password: '***' // Don't log actual password
      });
      
      onSave(credential);
      onOpenChange(false);
      toast.success(editingCredential ? 'Credential updated successfully' : 'Credential saved successfully');
    } catch (error) {
      console.error('Failed to save credential:', error);
      toast.error('Failed to save credential. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    if (website || username || password || folder) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmClose) return;
    }
    onOpenChange(false);
  };
  
  const showError = (field: keyof FormErrors) => touched[field] && errors[field];

  // Handle password generation
  const handlePasswordGenerated = (newPassword: string) => {
    console.log('Password generated in dialog:', newPassword);
    setPassword(newPassword);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {editingCredential ? 'Edit Credential' : 'Add New Credential'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          {/* Website Field */}
          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Website / URL
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="website"
              placeholder="example.com or https://example.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              onBlur={() => handleBlur('website')}
              className={showError('website') ? 'border-destructive focus-visible:ring-destructive' : ''}
              aria-invalid={showError('website') ? 'true' : 'false'}
              aria-describedby={showError('website') ? 'website-error' : undefined}
            />
            {showError('website') && (
              <p id="website-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.website}
              </p>
            )}
          </div>
          
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Username / Email
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="username"
              placeholder="user@example.com or username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => handleBlur('username')}
              className={showError('username') ? 'border-destructive focus-visible:ring-destructive' : ''}
              aria-invalid={showError('username') ? 'true' : 'false'}
              aria-describedby={showError('username') ? 'username-error' : undefined}
            />
            {showError('username') && (
              <p id="username-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.username}
              </p>
            )}
          </div>
          
          {/* Folder Field */}
          <div className="space-y-2">
            <Label htmlFor="folder" className="text-sm font-medium flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
              Folder
              <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Input
              id="folder"
              placeholder="e.g., Work, Personal, Social Media"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
            />
          </div>
          
          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
              Password
              <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`pr-10 ${showError('password') ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                aria-invalid={showError('password') ? 'true' : 'false'}
                aria-describedby={showError('password') ? 'password-error' : undefined}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {showError('password') && (
              <p id="password-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.password}
              </p>
            )}
            {password && !showError('password') && (
              <PasswordStrengthIndicator password={password} />
            )}
          </div>
          
          {/* Password Generator */}
          <div className="pt-2">
            <PasswordGenerator onPasswordGenerated={handlePasswordGenerated} />
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? (
              <>
                <span className="animate-pulse">Saving...</span>
              </>
            ) : (
              editingCredential ? 'Update Credential' : 'Save Credential'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}