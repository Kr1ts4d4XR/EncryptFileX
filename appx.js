const fs = require('fs');
const crypto = require('crypto');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to encrypt a file
function encryptFile(filePath, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const input = fs.createReadStream(filePath);
  const output = fs.createWriteStream(filePath + '.enc');

  input.pipe(cipher).pipe(output);

  console.log('File encrypted successfully!');
  console.log('Encryption key:', key.toString('hex'));
  console.log('IV:', iv.toString('hex'));
}

// Function to decrypt a file
function decryptFile(filePath, key, iv) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const input = fs.createReadStream(filePath);
  const output = fs.createWriteStream(filePath + '.decrypted');

  input.pipe(decipher).pipe(output);

  console.log('File decrypted successfully!');
}

readline.question('Enter file path: ', (filePath) => {
  readline.question('Encrypt or decrypt? (e/d) ', (mode) => {
    if (mode === 'e') {
      crypto.randomBytes(32, (err, key) => {
        if (err) throw err;
        encryptFile(filePath, key);
        readline.close();
      });
    } else if (mode === 'd') {
      readline.question('Enter decryption key: ', (keyStr) => {
        const key = Buffer.from(keyStr, 'hex');
        readline.question('Enter IV: ', (ivStr) => {
          const iv = Buffer.from(ivStr, 'hex');
          decryptFile(filePath, key, iv);
          readline.close();
        });
      });
    } else {
      console.log('Invalid mode. Please enter "e" or "d".');
      readline.close();
    }
  });
});
