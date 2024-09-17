import 'dotenv/config'
import { getKeyPair } from '../hash/getKeyPair'
import { generateTimestampz } from '../timestamp/generateTimestampz'
import crypto from 'crypto'
import { BSON } from 'bson'
import path from 'path'
import fs from 'fs'
import { encrypt } from './secure/encrypt/encrypt'
import { structWalletToSave } from '../../model/interface/walletStructinf'

// Formats the input string to show only the first and last three characters
const formatString = (input: string): string => {
  try {
    if (input.length < 6) {
      throw new Error('Input string must be at least 6 characters long.');
    }
    const firstThree = input.slice(0, 3);
    const lastThree = input.slice(-3);
    return `${firstThree}...${lastThree}`;
  } catch (error) {
    console.error('Error formatting string:', error);
    throw error; // Re-throw to allow calling functions to handle it
  }
}

// Saves the main wallet data to a file
export const saveMainWallet = (wallet: string): boolean => {
  try {
    const privateKey = getKeyPair().privateKey;
    const encryptedPrivateKey = encrypt(privateKey, process.env.WALLET_PASSWORD!);

    // Determine the file name and path
    const fileName = 'MainWallet';
    const dirPath = path.join(__dirname, '../../../wallet');
    const filePath = path.join(dirPath, `${fileName}.bin`);

    // Create directory if it does not exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Prepare the data to be saved
    const structToSave: structWalletToSave = {
      data: {
        wallet: wallet,
        publicKey: getKeyPair().publicKey,
        encryptPrivateKey: encryptedPrivateKey,
        decryptPrivateKey: formatString(privateKey),
      },
      metadata: {
        timestamp: generateTimestampz(),
        label: 'Main wallet',
      },
    };
    structToSave.checkSum = addCheckSum(structToSave);

    // Serialize the data and write to file
    const serializedData = BSON.serialize(structToSave);
    fs.writeFileSync(filePath, serializedData, 'binary');

    return true;
  } catch (error) {
    // Handle errors that occur during the saving process
    console.error('Error saving wallet:', error);
    return false;
  }
}

// Adds a checksum to the data for integrity verification
const addCheckSum = (data: any) => {
  try {
    const formatData = JSON.stringify(data);
    return crypto
      .createHash('sha512')
      .update(Buffer.from(formatData))
      .digest('hex');
  } catch (error) {
    console.error('Error generating checksum:', error);
    throw error; // Re-throw to allow calling functions to handle it
  }
}
