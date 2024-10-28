// import { decrypto, encrypto } from '../crypto'
import { localStg } from "../storage";

const TokenKey = "token";
const TokenPrefix = "Bearer ";

const isLoagin = () => {
  return !!localStorage.getItem(TokenKey);
};

const getToken = () => {
  return localStg.get(TokenKey);
  // const json = localStorage.getItem(TokenKey)
  // if (json) {
  //   let storageData = null;
  //   try {
  //     storageData = decrypto(json)
  //   } catch (error) {
  //     // throw new Error(error)
  //   }
  //   return storageData
  // }
  // return null
};

const setToken = (token: string) => {
  // const json = encrypto(token)
  // localStorage.setItem(TokenKey, json)
  localStg.set(TokenKey, token);
};

const clearToken = () => {
  // localStorage.removeItem(TokenKey)
  localStg.remove(TokenKey);
};

export { TokenPrefix, isLoagin, getToken, setToken, clearToken };
