import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import Web3 from "web3";
import Tx from "ethereumjs-tx";
import bip39 from 'bip39';
import { Buffer } from "buffer";
import { environment } from "../../../environments/environment.stage";
import { isPlatformBrowser } from "@angular/common";

declare var require;
@Injectable()
export class Web3Service {
  web3: Web3;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.web3 = new Web3(new Web3.providers.HttpProvider(environment.NODE_URL));
    }
  }

  create() {
    let bip39 = require("bip39");
    var mnemonic = bip39.generateMnemonic();
    let hdkey = require("ethereumjs-wallet/hdkey");
    let hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
    let wallet_hdpath = "m/44'/60'/0'/0/";
    let wallet = hdwallet.derivePath(wallet_hdpath + 0).getWallet();
    let address = "0x" + wallet.getAddress().toString("hex");
    let publicKey = wallet.getPublicKey().toString("hex");
    let privateKey = "0x" + wallet.getPrivateKey().toString("hex");
    let account = { mnemonic, address, publicKey, privateKey };
    return account;
  }

  backup(mnemonic) {
    try {
      let bip39 = require("bip39");
      if (bip39.validateMnemonic(mnemonic)) {
        let hdkey = require("ethereumjs-wallet/hdkey");
        let hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
        let wallet_hdpath = "m/44'/60'/0'/0/";
        let wallet = hdwallet.derivePath(wallet_hdpath + 0).getWallet();
        let address = "0x" + wallet.getAddress().toString("hex");
        let publicKey = wallet.getPublicKey().toString("hex");
        let privateKey = '0x' + wallet.getPrivateKey().toString("hex");
        let account = { mnemonic, address, publicKey, privateKey };
        return account;
      }
      else {
        return null;
      }
    }
    catch{
      return null;
    }
  }

  hashToSign(stringHash, privkey) {
    return this.web3.eth.accounts.sign("" + stringHash, privkey).signature;
  }

  sendToken(params): Promise<string> {
    return this.signAndSendTransaction({
      from: params.from,
      to: params.to,
      gas: this.web3.utils.toHex('100000'),//this.web3.utils.toHex(this.settings.gas),
      gasPrice: this.web3.utils.toHex(this.web3.utils.toWei(params.gasPrice.toString(), 'gwei')),//this.web3.utils.toHex(this.settings.gasPrice),
      value: "0x0",
      pvk: params.pvk,
      data:
        "0xa9059cbb" +
        this.padStart(64, 0, params.toAddress.substr(2)) +
        this.padStart(
          64,
          0,
          (params.amount * Math.pow(10, params.decimalPlaces)).toString(
            16
          )
        )
    });
  }

  stringtoHash(string) {
    return this.web3.eth.accounts.hashMessage("" + string);
  }

  private signAndSendTransaction(transactionObject): Promise<string> {
      return new Promise((resolve, reject) => {
      this.web3.eth
        .getTransactionCount(transactionObject.from, "latest")
        .then((nonce: number) => {
          transactionObject.nonce = nonce;
          let tx: Tx;
          try {
            tx = new Tx(transactionObject);
            tx.sign(new Buffer(transactionObject.pvk.substr(2), "hex"));
          } catch (e) {
            reject(e);
            return;
          }
          this.web3.eth
            .sendSignedTransaction(
              "0x" + tx.serialize().toString("hex"),
              (error, hash: string) => {
                if (error) {
                    let message;
                  if (error.message.includes('nonce too low')) {
                    message = "Nonce too low";
                  }
                  if (error.message.includes('nonce may not be larger than')){
                    message = "Invalid Nonce";
                  }
                  if (error.message.includes('insufficient funds for gas')){
                    message = "Insufficient funds for gas";
                  }
                  if (error.message.includes('intrinsic gas too low')){
                    message = "Intrinsic gas too low";
                  }
                  reject(message);
                } else {
                    resolve(hash);
                }
              }
            )
            .then(receipt => {
              console.log('okay', receipt);
            })
            .catch(error => {
              console.log('error', error);
            });
        });
    });
  }

  getEthBalance(address) {
    return this.web3.eth.getBalance(address);
  }

  checkValidAddress(address) {
    return this.web3.utils.isAddress(address);
  }

  private padStart(targetLength, padString, str) {
    targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
    padString = String(typeof padString !== "undefined" ? padString : " ");
    if (str.length > targetLength) {
      return String(str);
    } else {
      targetLength = targetLength - str.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return padString.slice(0, targetLength) + String(str);
    }
  }
}
