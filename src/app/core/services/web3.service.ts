import { Injectable } from "@angular/core";
import Web3 from "web3";
import Tx from "ethereumjs-tx";
import bip39 from 'bip39';
import { Buffer } from "buffer";
import { environment } from "../../../environments/environment.stage";

declare var require;
@Injectable()
export class Web3Service {
  pbk: string;
  pvk: string;
  address: string;
  wallet;
  web3: Web3 = new Web3(new Web3.providers.HttpProvider(environment.NODE_URL));
  account;
  constructor() {
    
  }

  create() {
    //let bip39 = require("bip39");
    var mnemonic = bip39.generateMnemonic();
    let hdkey = require("ethereumjs-wallet/hdkey");
    let hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
    let wallet_hdpath = "m/44'/60'/0'/0/";
    let account = {};
    let wallet = hdwallet.derivePath(wallet_hdpath + 0).getWallet();
    let address = "0x" + wallet.getAddress().toString("hex");
    let publicKey = wallet.getPublicKey().toString("hex");
    let privateKey = wallet.getPrivateKey().toString("hex");
    account = { address, publicKey, privateKey };
    this.account =account;
    return mnemonic;
  }

  backup(mnemonic) {
    let bip39 = require("bip39");
    if (bip39.validateMnemonic(mnemonic)) {
      let hdkey = require("ethereumjs-wallet/hdkey");
      let hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
      let wallet_hdpath = "m/44'/60'/0'/0/";
      let account = {};
      let wallet = hdwallet.derivePath(wallet_hdpath + 0).getWallet();
      let address = "0x" + wallet.getAddress().toString("hex");
      let publicKey = wallet.getPublicKey().toString("hex");
      let privateKey = wallet.getPrivateKey().toString("hex");
      account = { address, publicKey, privateKey };
      this.account = account;
      return true;
    }
    return false;
  }

  hashToSign(stringHash, privkey) {
    return this.web3.eth.accounts.sign(stringHash, privkey).signature;
}

  sendToken(params): Promise<string> {
    return this.signAndSendTransaction({
      from: this.address,
      to: params.token.contractAddress,
      gas: 10000,//this.web3.utils.toHex(this.settings.gas),
      gasPrice: 1000,//this.web3.utils.toHex(this.settings.gasPrice),
      // value: "0x0",
      data:
        "0xa9059cbb" +
        this.padStart(64, 0, params.toAddress.substr(2)) +
        this.padStart(
          64,
          0,
          (params.amount * Math.pow(10, params.token.decimalPlaces)).toString(
            16
          )
        )
    });
  }

  sendEthereum(params): Promise<string> {
    return this.signAndSendTransaction({
      to: params.toAddress,
      gas: this.web3.utils.toHex(21000),
      gasPrice: 10000,//this.web3.utils.toHex(this.settings.gasPrice),
      value: this.web3.utils.toHex(
        this.web3.utils.toWei(params.amount.toString(), "ether")
      )
    });
  }

  private signAndSendTransaction(transactionObject): Promise<string> {
    return new Promise((resolve, reject) => {
      this.web3.eth
        .getTransactionCount(this.address, "pending")
        .then((nonce: number) => {
          transactionObject.nonce = nonce;

          let tx: Tx;
          try {
            tx = new Tx(transactionObject);
            tx.sign(new Buffer(this.pvk, "hex"));
          } catch (e) {
            reject(e);
            return;
          }
          this.web3.eth
            .sendSignedTransaction(
              "0x" + tx.serialize().toString("hex"),
              (error, hash: string) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(hash);
                }
              }
            )
            .then(receipt => {})
            .catch(error => {});
        });
    });
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
