import { useState } from 'react';
import { Lock, Eye, EyeOff, Copy, Edit, Trash2, ExternalLink, Check, FolderOpen, Globe, Mail, Clock } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Credential } from '@/src/app/Types/vault';
import { log } from 'console';

interface CredentialCardProps {
  credential: Credential;
  decryptedPassword: string;
  onEdit: (credential: Credential) => void;
  onDelete: (id: string) => void;
}

export function CredentialCard({ 
  credential, 
  decryptedPassword,
  onEdit, 
  onDelete 
}: CredentialCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedUsername, setCopiedUsername] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  console.log();
  
  // Handle undefined/null decryptedPassword
  const safeDecryptedPassword = decryptedPassword || '';
  
  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(safeDecryptedPassword);
      setCopied(true);
      toast.success('Password copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy password');
    }
  };
  
  const handleCopyUsername = async () => {
    try {
      await navigator.clipboard.writeText(credential.username);
      setCopiedUsername(true);
      toast.success('Username copied to clipboard');
      setTimeout(() => setCopiedUsername(false), 2000);
    } catch (error) {
      toast.error('Failed to copy username');
    }
  };
  
  const handleOpenWebsite = () => {
    if (!credential.url) return;
    
    let url = credential.url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  const handleDelete = () => {
    onDelete(credential.id);
    setShowDeleteDialog(false);
    toast.success('Credential deleted successfully');
  };
  
  // Safe masked password calculation
  const maskedPassword = '•'.repeat(Math.min(safeDecryptedPassword.length, 16));
  console.log(maskedPassword);
  
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };
  
  return (
    <>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20 hover:scale-[1.02] border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-slate-900">
        <CardHeader className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 p-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-500/20 group-hover:ring-indigo-400/40 transition-all duration-300 group-hover:scale-110">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-lg leading-tight break-words flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  {credential.website}
                </h3>
                {credential.folder && (
                  <Badge className="mt-2 w-fit text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 border-purple-200 dark:border-purple-800">
                    <FolderOpen className="h-3 w-3 mr-1" />
                    {credential.folder}
                  </Badge>
                )}
              </div>
            </div>
            {credential.url && (
              <Button
                size="icon"
                variant="ghost"
                onClick={handleOpenWebsite}
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
                title="Open website"
              >
                <ExternalLink className="h-5 w-5" />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 p-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
          {/* Username Section */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <Mail className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              Username
            </label>
            <div className="flex items-center gap-2 group/username">
              <div className="flex-1 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 px-4 py-2.5 text-sm border-2 border-blue-200 dark:border-blue-800 group-hover/username:border-blue-400 dark:group-hover/username:border-blue-600 transition-colors text-slate-900 dark:text-slate-100">
                {credential.username}
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCopyUsername}
                className="shrink-0 opacity-0 group-hover/username:opacity-100 transition-opacity hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400"
                title="Copy username"
              >
                {copiedUsername ? (
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Password Section */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <Lock className="h-3 w-3 text-purple-600 dark:text-purple-400" />
              Password
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 px-4 py-2.5 font-mono text-sm border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-colors overflow-hidden text-slate-900 dark:text-slate-100">
                <span className="break-all">
                  {showPassword ? safeDecryptedPassword : maskedPassword}
                </span>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-600 dark:text-purple-400"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCopyPassword}
                  className="hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-600 dark:text-purple-400"
                  title="Copy password"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all group/edit shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
              onClick={() => onEdit(credential)}
            >
              <Edit className="mr-2 h-4 w-4 group-hover/edit:rotate-12 transition-transform" />
              Edit
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white transition-all group/delete shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4 group-hover/delete:scale-110 transition-transform" />
              Delete
            </Button>
          </div>
          
          {/* Metadata */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t-2 border-slate-200 dark:border-slate-800">
            <Clock className="h-3 w-3 text-slate-500 dark:text-slate-400" />
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Updated {formatDate(credential.updatedAt)}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white dark:bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              Delete Credential?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 text-slate-600 dark:text-slate-400">
              <p>
                Are you sure you want to delete the credential for{' '}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{credential.website}</span>?
              </p>
              <p className="text-sm bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-amber-900 dark:text-amber-100">
                ⚠️ This action cannot be undone. The credential will be permanently deleted.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-500/30"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}