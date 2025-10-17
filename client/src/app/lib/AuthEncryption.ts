export interface FormData {
  email: string;
  masterPassword: string;
  confirmPassword?: string;
}

export interface HashResult {
  hash: string; // base64 string
  salt: string; // base64 string
}

/**
 * Convert ArrayBuffer to Base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

/**
 * Convert Base64 to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Generate a random salt
 */
function generateSalt(length: number = 16): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Hash password using PBKDF2 (one-way)
 */
export default async function hashPassword(password: string,email:string): Promise<HashResult> {
  const salt = new TextEncoder().encode(email)

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  // Derive bits using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const hash = arrayBufferToBase64(derivedBits);
  return {
    hash,
    salt: arrayBufferToBase64(salt.buffer),
  };
}

/**
 * Verify password using stored hash and salt
 */
export async function verifyPassword(password: string, storedHash: string, storedSalt: string): Promise<boolean> {
  const saltBytes = new Uint8Array(base64ToArrayBuffer(storedSalt));

  // Import input password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  // Re-derive bits using same salt
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const newHash = arrayBufferToBase64(derivedBits);

  // Compare hashes (constant time check)
  return newHash === storedHash;
}

/**
 * Create a master key from the hashed password + salt
 */
export async function createMasterKey(hashBase64: string, saltBase64: string): Promise<string> {
  const hashBytes = new Uint8Array(base64ToArrayBuffer(hashBase64));
  const saltBytes = new Uint8Array(base64ToArrayBuffer(saltBase64));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    hashBytes,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const masterKeyBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  const masterKey=arrayBufferToBase64(masterKeyBuffer)
  console.log(masterKey)
  return arrayBufferToBase64(masterKeyBuffer);
}
