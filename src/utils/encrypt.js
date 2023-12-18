import CryptoJS from 'crypto-js';

// Function to encrypt the API key
export const encryptApiKey = (apiKey) => {
  const encrypted = CryptoJS.AES.encrypt(apiKey, 'secret passphrase');
  return encrypted.toString();
};

// Function to decrypt the encrypted API key
export const decryptApiKey = (encryptedApiKey) => {
  const bytes = CryptoJS.AES.decrypt(encryptedApiKey, 'secret passphrase');
  const originalApiKey = bytes.toString(CryptoJS.enc.Utf8);
  return originalApiKey;
};

