import CryptoJS from "crypto-js";

const CryptoSecret = "__CryptoJS_Secret__";

/**
 * 加密数据
 * @param data - 数据
 */
export function encrypto(data: any) {
  const newData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(newData, CryptoSecret).toString();
}

/**
 * 解密数据
 * @param cipherText - 密文
 */
export function decrypto(cipherText: string) {
  const bytes = CryptoJS.AES.decrypt(cipherText, CryptoSecret);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  if (originalText) {
    return JSON.parse(originalText);
  }
  return null;
}

export class CryptoAES {
  secretKey: CryptoJS.lib.WordArray;
  params: any;
  constructor(secretKey: string, params?: any) {
    this.secretKey = this.parseEncode(secretKey || "!QWE@_890AnY6Z7X");
    this.params = params || {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    };
  }
  parseEncode(s: string): CryptoJS.lib.WordArray {
    return CryptoJS.enc.Utf8.parse(s);
  }
  toString(v: string | CryptoJS.lib.CipherParams): string {
    return v.toString();
  }
  stringifyEncode(v: CryptoJS.lib.WordArray): string {
    return CryptoJS.enc.Utf8.stringify(v);
  }
  // enCode(v: string | number | boolean): string {
  //   return encodeURIComponent(v)
  // }
  // deCode(v: string): string {
  //   return decodeURIComponent(v)
  // }
  encrypt(value: string): string {
    const word = this.parseEncode(value);
    const encrypted = CryptoJS.AES.encrypt(word, this.secretKey, this.params);
    // return this.enCode(this.toString(encrypted))
    return this.toString(encrypted);
  }
  decrypt(value: string): string {
    // let v = this.deCode(value)
    const decrypt = CryptoJS.AES.decrypt(value, this.secretKey, this.params);

    return decrypt ? this.toString(this.stringifyEncode(decrypt)) : "";
  }
}
