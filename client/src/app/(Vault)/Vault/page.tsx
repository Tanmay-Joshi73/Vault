'use client'
import { useState, useEffect } from 'react';
import { Plus, Search, Grid3x3, List, ChevronDown, Download, Upload, FolderOpen } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import { useRouter } from 'next/navigation';
import { StoredUserId } from '../../lib/Store/MasterKeyContext';
import axios from 'axios';
import useMasterKeyStore from '../../lib/Store/MasterKeyContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { CredentialCard } from '../../Components/Landing/Vault/CredentialsCard';
import { AddCredentialDialog } from '../../Components/Landing/Vault/AddCredentialDialog';
import { EmptyState } from '../../Components/Landing/Vault/EmptyState';
import { ThemeToggle } from '../../Components/Landing/Vault/ThemeToggle';
import { encryptData, decryptData } from '../../lib/encryption';
import { toast } from 'sonner';
import type { Credential, EncryptedCredential, ViewMode, SortOption } from '../../Types/vault';
import { Lock, X, Check, ArrowBigDownIcon } from 'lucide-react';

// API endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const GetvaultData = `${API_BASE_URL}/user/getVaultData/Email`;
const PostvaultData = `${API_BASE_URL}/user/AddvaultData`;
const DeleteVaultData = `${API_BASE_URL}/user/DeletevaultData`;

const Vault = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | undefined>();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { masterKey } = useMasterKeyStore();
  const MASTER_PASSWORD = masterKey || '';
  const userId = StoredUserId();

  // Fetch credentials from database on mount
  useEffect(() => {
    if (!MASTER_PASSWORD || MASTER_PASSWORD === '') {
      router.push('/Login');
      return;
    }
    fetchCredentials();
  }, [MASTER_PASSWORD, router]);

  // Function to encrypt individual fields
  const encryptField = async (data: string): Promise<string> => {
    if (!data) return '';
    return await encryptData(data, MASTER_PASSWORD);
  };

  // Function to decrypt individual fields
  const decryptField = async (encryptedData: string): Promise<string> => {
    if (!encryptedData) return '';
    return await decryptData(encryptedData, MASTER_PASSWORD);
  };

 // In your Vault component
const fetchCredentials = async () => {
  try {
    setLoading(true);
    console.log('🔄 Fetching credentials for:', userId.Email);
    
    const response = await axios.get(GetvaultData, {
      params: { Email: userId.Email },
      headers: {
        'Authorization': `Bearer ${MASTER_PASSWORD}`,
      },
    });

    console.log('📨 Backend response:', response.data);

    // TEMPORARY FIX: Handle both response formats
    let encryptedCredentials = [];
    let success = false;

    if (response.data.success !== undefined) {
      // New format: { success: true, data: [...] }
      success = response.data.success;
      encryptedCredentials = response.data.data || [];
    } else if (response.data.entries !== undefined) {
      // Old format: { message: ..., totalEntries: ..., entries: [...] }
      success = true; // Assume success if we have entries
      encryptedCredentials = response.data.entries.map((entry, index) => ({
        id: entry._id?.toString() || `temp-${index}`,
        encryptedWebsite: entry.encryptedWebsite || entry.website,
        encryptedUsername: entry.encryptedUsername || entry.username,
        encryptedPassword: entry.encryptedPassword || entry.password,
        encryptedUrl: entry.encryptedUrl || entry.url,
        encryptedFolder: entry.encryptedFolder || entry.folder,
        encryptedNotes: entry.encryptedNotes || entry.notes,
        createdAt: entry.createdAt || new Date().toISOString(),
        updatedAt: entry.updatedAt || new Date().toISOString(),
        email: userId.Email
      }));
    }

    console.log('✅ Processed credentials:', { success, count: encryptedCredentials.length });

    if (success && encryptedCredentials.length > 0) {
      // Decrypt all credentials (your existing decryption logic)
      const decryptedCredentials: Credential[] = [];

      for (const encryptedCred of encryptedCredentials) {
        try {
          const [website, username, password, url, folder, notes] = await Promise.all([
            decryptField(encryptedCred.encryptedWebsite),
            decryptField(encryptedCred.encryptedUsername),
            decryptField(encryptedCred.encryptedPassword),
            encryptedCred.encryptedUrl ? decryptField(encryptedCred.encryptedUrl) : Promise.resolve(''),
            encryptedCred.encryptedFolder ? decryptField(encryptedCred.encryptedFolder) : Promise.resolve(''),
            encryptedCred.encryptedNotes ? decryptField(encryptedCred.encryptedNotes) : Promise.resolve(''),
          ]);

          const decryptedCred: Credential = {
            id: encryptedCred.id,
            website,
            username,
            password,
            url: url || undefined,
            folder: folder || undefined,
            notes: notes || undefined,
            createdAt: encryptedCred.createdAt,
            updatedAt: encryptedCred.updatedAt,
            email: encryptedCred.email,
          };

          decryptedCredentials.push(decryptedCred);
        } catch (error) {
          console.error('❌ Failed to decrypt credential:', encryptedCred.id, error);
        }
      }

      console.log('🎉 Final decrypted credentials:', decryptedCredentials);
      setCredentials(decryptedCredentials);
    } else if (success && encryptedCredentials.length === 0) {
      console.log('📭 No credentials found');
      setCredentials([]);
    } else {
      console.error('❌ Backend returned success: false');
      toast.error('Failed to fetch credentials');
    }
  } catch (error) {
    console.error('❌ Error fetching credentials:', error);
    toast.error('Failed to load credentials from database');
  } finally {
    setLoading(false);
  }
};

  const encryptCredentialForServer = async (credential: Credential): Promise<EncryptedCredential> => {
    // Encrypt all sensitive fields before sending to server
    const [
      encryptedWebsite,
      encryptedUsername,
      encryptedPassword,
      encryptedUrl,
      encryptedFolder,
      encryptedNotes
    ] = await Promise.all([
      encryptField(credential.website),
      encryptField(credential.username),
      encryptField(credential.password),
      credential.url ? encryptField(credential.url) : Promise.resolve(''),
      credential.folder ? encryptField(credential.folder) : Promise.resolve(''),
      credential.notes ? encryptField(credential.notes) : Promise.resolve(''),
    ]);

    return {
      id: credential.id,
      encryptedWebsite,
      encryptedUsername,
      encryptedPassword,
      encryptedUrl: encryptedUrl || undefined,
      encryptedFolder: encryptedFolder || undefined,
      encryptedNotes: encryptedNotes || undefined,
      createdAt: credential.createdAt,
      updatedAt: new Date().toISOString(),
      email: userId.Email,
    };
  };

  const handleSaveCredential = async (credential: Credential) => {
    const tempId = editingCredential ? credential.id : `temp-${Date.now()}`;
    const optimisticCredential: Credential = {
      ...credential,
      id: tempId,
      createdAt: editingCredential ? credential.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistically update UI immediately with decrypted data
    if (editingCredential) {
      setCredentials(prev => 
        prev.map(c => c.id === optimisticCredential.id ? optimisticCredential : c)
      );
    } else {
      setCredentials(prev => [...prev, optimisticCredential]);
    }

    try {
      // Encrypt all credential data before sending to server
      const encryptedCredential = await encryptCredentialForServer(credential);
      
      let response;
      
      if (editingCredential) {
        // Update existing credential
        response = await axios.put(
          `${CREDENTIALS_API}/${credential.id}`,
          encryptedCredential,
          {
            headers: {
              'Authorization': `Bearer ${MASTER_PASSWORD}`,
            },
          }
        );
      } else {
        // Create new credential
        response = await axios.post(
          PostvaultData,
          encryptedCredential,
          {
            headers: {
              'Authorization': `Bearer ${MASTER_PASSWORD}`,
            },
          }
        );
      }

      if (response.data.success) {
        const savedEncryptedCredential: EncryptedCredential = response.data.data;
        
        // Decrypt the saved credential for UI
        try {
          const [
            website, username, password, url, folder, notes
          ] = await Promise.all([
            decryptField(savedEncryptedCredential.encryptedWebsite),
            decryptField(savedEncryptedCredential.encryptedUsername),
            decryptField(savedEncryptedCredential.encryptedPassword),
            savedEncryptedCredential.encryptedUrl ? decryptField(savedEncryptedCredential.encryptedUrl) : Promise.resolve(''),
            savedEncryptedCredential.encryptedFolder ? decryptField(savedEncryptedCredential.encryptedFolder) : Promise.resolve(''),
            savedEncryptedCredential.encryptedNotes ? decryptField(savedEncryptedCredential.encryptedNotes) : Promise.resolve(''),
          ]);

          const savedDecryptedCredential: Credential = {
            id: savedEncryptedCredential.id,
            website,
            username,
            password,
            url: url || undefined,
            folder: folder || undefined,
            notes: notes || undefined,
            createdAt: savedEncryptedCredential.createdAt,
            updatedAt: savedEncryptedCredential.updatedAt,
            email: savedEncryptedCredential.email,
          };

          // Replace optimistic update with real decrypted data
          if (editingCredential) {
            setCredentials(prev => 
              prev.map(c => c.id === savedDecryptedCredential.id ? savedDecryptedCredential : c)
            );
          } else {
            // Remove temporary credential and add the real one
            setCredentials(prev => [
              ...prev.filter(c => c.id !== tempId),
              savedDecryptedCredential
            ]);
          }

        } catch (decryptError) {
          console.error('Failed to decrypt saved credential:', decryptError);
          toast.error('Saved credential but failed to decrypt it');
        }
        
        setEditingCredential(undefined);
        setDialogOpen(false);
        toast.success(`Credential ${editingCredential ? 'updated' : 'added'} successfully`);
      } else {
        toast.error(`Failed to ${editingCredential ? 'update' : 'add'} credential`);
      }
    } catch (error) {
      console.error('Error saving credential:', error);
      
      // If API call failed, revert optimistic updates
      if (!editingCredential) {
        setCredentials(prev => prev.filter(c => c.id !== tempId));
      } else {
        // For edits, revert by refetching
        await fetchCredentials();
      }
      
      toast.error(`Failed to ${editingCredential ? 'update' : 'add'} credential`);
    }
  };
  
  const handleEdit = (credential: Credential) => {
    setEditingCredential(credential);
    setDialogOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    console.log(id)
  if (!confirm('Are you sure you want to delete this credential?')) {
    return
  }

  try {
    const response = await axios.delete(DeleteVaultData, {
      data: {
        email: userId.Email,
        credentialId: id
      },
      headers: {
        'Authorization': `Bearer ${MASTER_PASSWORD}`,
      },
    });

    if (response.data.success) {
      setCredentials(prev => prev.filter(c => c.id !== id));
      toast.success('Credential deleted successfully');
    } else {
      toast.error(response.data.message || 'Failed to delete credential');
    }
  } catch (error) {
    console.error('Error deleting credential:', error);
    toast.error('Failed to delete credential');
  }
};
  
  const handleAddNew = () => {
    setEditingCredential(undefined);
    setDialogOpen(true);
  };
  
  const handleExport = async () => {
    if (credentials.length === 0) {
      toast.error('No credentials to export');
      return;
    }

    try {
      // Encrypt all credentials for export
      const encryptedCredentials: EncryptedCredential[] = [];
      for (const cred of credentials) {
        const encryptedCred = await encryptCredentialForServer(cred);
        encryptedCredentials.push(encryptedCred);
      }

      const exportData = JSON.stringify(encryptedCredentials, null, 2);
      const encryptedExportData = await encryptData(exportData, MASTER_PASSWORD);
      
      const blob = new Blob([encryptedExportData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vault-backup-${new Date().toISOString().split('T')[0]}.vault`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Credentials exported successfully');
    } catch (error) {
      console.error('Error exporting credentials:', error);
      toast.error('Failed to export credentials');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.vault';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const encryptedData = await file.text();
        const decryptedData = await decryptData(encryptedData, MASTER_PASSWORD);
        const importedEncryptedCredentials: EncryptedCredential[] = JSON.parse(decryptedData);
        
        // Upload each encrypted credential to the database
        for (const encryptedCred of importedEncryptedCredentials) {
          await axios.post(PostvaultData, encryptedCred, {
            headers: {
              'Authorization': `Bearer ${MASTER_PASSWORD}`,
            },
          });
        }
        
        // Refresh the credentials list
        await fetchCredentials();
        
        toast.success(`Imported ${importedEncryptedCredentials.length} credentials`);
      } catch (error) {
        console.error('Error importing credentials:', error);
        toast.error('Failed to import credentials. Invalid file or password.');
      }
    };
    input.click();
  };
  
  // Get unique folders
  const folders = Array.from(new Set(credentials.map(c => c.folder).filter(Boolean))) as string[];
  
  // Filter credentials based on search and folder
  const filteredCredentials = credentials.filter(cred => {
    const matchesSearch = cred.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = !selectedFolder || cred.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });
  
  // Sort credentials
  const sortedCredentials = [...filteredCredentials].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.website.localeCompare(b.website);
      case 'folder':
        return (a.folder || '').localeCompare(b.folder || '');
      case 'date':
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });
  
  const sortLabels: Record<SortOption, string> = {
    name: 'Name (a-z)',
    folder: 'Folder (a-z)',
    date: 'Last updated',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading credentials...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-2 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between gap-4">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Passwords
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {credentials.length} saved credential{credentials.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {credentials.length > 0 && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExport}
                    className="gap-2 border-2 hover:border-green-400 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
                  >
                    <Download className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleImport}
                    className="gap-2 border-2 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                  >
                    <Upload className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="hidden sm:inline">Import</span>
                  </Button>
                </>
              )}
              <ThemeToggle />
            </div>
          </div>
          
          {/* Filters and Search */}
          {credentials.length > 0 && (
            <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-3">
                {/* Folder filter */}
                {folders.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Folders:
                    </span>
                    <Badge
                      variant={selectedFolder === null ? "default" : "outline"}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        selectedFolder === null 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30' 
                          : 'hover:border-indigo-400 dark:hover:border-indigo-600'
                      }`}
                      onClick={() => setSelectedFolder(null)}
                    >
                      All
                    </Badge>
                    {folders.map(folder => (
                      <Badge
                        key={folder}
                        variant={selectedFolder === folder ? "default" : "outline"}
                        className={`cursor-pointer transition-all hover:scale-105 ${
                          selectedFolder === folder 
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30' 
                            : 'hover:border-indigo-400 dark:hover:border-indigo-600'
                        }`}
                        onClick={() => setSelectedFolder(folder)}
                      >
                        <FolderOpen className="h-3 w-3 mr-1" />
                        {folder}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Right side controls */}
                <div className="flex items-center gap-2 ml-auto flex-wrap">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search credentials..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 pl-9 border-2 focus:border-indigo-400 dark:focus:border-indigo-600 transition-colors"
                    />
                  </div>
                  
                  {/* View toggles */}
                  <div className="flex rounded-lg border-2 border-slate-200 dark:border-slate-800 overflow-hidden">
                    <Button
                      size="icon"
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('list')}
                      className={`rounded-none ${
                        viewMode === 'list' 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title="List view"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('grid')}
                      className={`rounded-none ${
                        viewMode === 'grid' 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title="Grid view"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Sort dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="gap-2 border-2 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
                      >
                        <ArrowBigDownIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Sort: {sortLabels[sortBy]}</span>
                        <span className="sm:hidden">{sortLabels[sortBy]}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem 
                        onClick={() => setSortBy('name')}
                        className={sortBy === 'name' ? 'bg-indigo-50 dark:bg-indigo-950' : ''}
                      >
                        <span className="flex items-center gap-2">
                          {sortBy === 'name' && <Check className="h-4 w-4" />}
                          Name (A-Z)
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setSortBy('folder')}
                        className={sortBy === 'folder' ? 'bg-indigo-50 dark:bg-indigo-950' : ''}
                      >
                        <span className="flex items-center gap-2">
                          {sortBy === 'folder' && <Check className="h-4 w-4" />}
                          Folder (A-Z)
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setSortBy('date')}
                        className={sortBy === 'date' ? 'bg-indigo-50 dark:bg-indigo-950' : ''}
                      >
                        <span className="flex items-center gap-2">
                          {sortBy === 'date' && <Check className="h-4 w-4" />}
                          Last Updated
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {credentials.length === 0 ? (
          <EmptyState onAddCredential={handleAddNew} />
        ) : (
          <>
            {/* Results count */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {filteredCredentials.length === sortedCredentials.length ? (
                    <>
                      Showing <span className="font-bold text-indigo-600 dark:text-indigo-400">{filteredCredentials.length}</span> {filteredCredentials.length === 1 ? 'credential' : 'credentials'}
                    </>
                  ) : (
                    <>
                      Found <span className="font-bold text-indigo-600 dark:text-indigo-400">{filteredCredentials.length}</span> of {sortedCredentials.length} credentials
                    </>
                  )}
                  {searchQuery && (
                    <span className="ml-1">
                      matching <span className="font-semibold text-slate-900 dark:text-slate-100">"{searchQuery}"</span>
                    </span>
                  )}
                </p>
              </div>
              
              {/* Clear filters button */}
              {(searchQuery || selectedFolder) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFolder(null);
                  }}
                  className="gap-2 border-2 hover:border-red-400 dark:hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
            
            {/* Credentials grid/list */}
            <div className={
              viewMode === 'grid' 
                ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'space-y-4'
            }>
              {sortedCredentials.map(credential => (
                <CredentialCard
                  key={credential.id}
                  credential={credential}
                  decryptedPassword={credential.password}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            
            {/* No results message */}
            {filteredCredentials.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex p-6 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                  <Search className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No credentials found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFolder(null);
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      
      {/* FAB - Floating Action Button */}
      {credentials.length > 0 && (
        <Button
          size="icon"
          onClick={handleAddNew}
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white group shadow-indigo-500/50 hover:shadow-indigo-500/70 z-40"
          title="Add new credential"
        >
          <Plus className="h-7 w-7 group-hover:rotate-90 transition-transform duration-300" />
        </Button>
      )}
      
      {/* Add/Edit Dialog */}
      <AddCredentialDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingCredential(undefined);
        }}
        onSave={handleSaveCredential}
        editingCredential={editingCredential}
      />
    </div>
  );
};

export default Vault;