import Crypto from 'crypto';
export const generateRandomCode = (length = 6): string => {
  return Math.floor(Math.random() * Math.pow(10, length)).toString();
};

export const cryptoHash = (plainText: string): string => {
  return Crypto.createHash('sha256').update(plainText).digest('hex');
};
