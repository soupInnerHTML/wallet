// @ts-ignore
import SecureStorage from 'secure-web-storage'
import crypto from 'crypto-js'

const SECRET_KEY = process.env.REACT_APP_SECURE_STORAGE_KEY!

export const secureStorage = new SecureStorage(localStorage, {
  hash: (key: any) =>  {
    key = crypto.SHA256(key, {key: SECRET_KEY});

    return key.toString();
  },
  encrypt: function encrypt(data: any) {
    data = crypto.AES.encrypt(data, SECRET_KEY);

    data = data.toString();

    return data;
  },
  decrypt: function decrypt(data: any) {
    data = crypto.AES.decrypt(data, SECRET_KEY);

    data = data.toString(crypto.enc.Utf8);

    return data;
  }
});
