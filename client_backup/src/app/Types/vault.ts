export interface EncryptedCredential {
  id: string;
  encryptedWebsite: string;
  encryptedUsername: string;
  encryptedPassword: string;
  encryptedUrl?: string;
  encryptedFolder?: string;
  encryptedNotes?: string;
  createdAt: string;
  updatedAt: string;
  email?: string | null;
}

export interface DecryptedCredential {
  id: string;
  website: string;
  username: string;
  password: string;
  url?: string;
  folder?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  email?: string | null;
}

// Remove the duplicate Credential interface and use this:
export type Credential = DecryptedCredential; // Use decrypted for UI

export interface PasswordGeneratorOptions {
  length: number;
  includeLetters: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeLookalikes: boolean;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'name' | 'folder' | 'date';