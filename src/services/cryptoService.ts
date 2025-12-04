// Using Web Crypto API for secure, local-only encryption.

// Helper to convert string to ArrayBuffer
const strToBuf = (str: string) => new TextEncoder().encode(str);
// Helper to convert ArrayBuffer to Base64
const bufToBase64 = (buf: ArrayBuffer) => {
  const binString = Array.from(new Uint8Array(buf), (byte) =>
    String.fromCharCode(byte)
  ).join("");
  return btoa(binString);
};
// Helper to convert Base64 to ArrayBuffer
const base64ToBuf = (base64: string) => {
  const binString = atob(base64);
  return Uint8Array.from(binString, (c) => c.charCodeAt(0));
};

// Generate a key from the master password using PBKDF2
export const deriveKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    strToBuf(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

// Encrypt data
export const encryptData = async (data: string, masterPassword: string): Promise<string> => {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(masterPassword, salt);
  
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    strToBuf(data)
  );

  // Pack salt + iv + encrypted data into a single string
  const packed = JSON.stringify({
    salt: bufToBase64(salt),
    iv: bufToBase64(iv),
    data: bufToBase64(encrypted),
  });
  
  return btoa(packed);
};

// Decrypt data
export const decryptData = async (packedData: string, masterPassword: string): Promise<string | null> => {
  try {
    const json = JSON.parse(atob(packedData));
    const salt = base64ToBuf(json.salt);
    const iv = base64ToBuf(json.iv);
    const data = base64ToBuf(json.data);

    const key = await deriveKey(masterPassword, salt);
    
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch (e) {
    console.error("Decryption failed", e);
    return null;
  }
};

// Simple hash for master password verification (don't store plain master password)
export const hashPassword = async (password: string): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};