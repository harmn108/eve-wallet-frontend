import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';


@Injectable()
export class CryptService {

    static brainKeyDecrypt(brainKey, password) {
        return CryptoJS.AES.decrypt(brainKey, password).toString(CryptoJS.enc.Utf8);
    }

    static brainKeyEncrypt(brainKey, password) {
        return CryptoJS.AES.encrypt(brainKey, password).toString();
    }

    static stringToHash(signString) {
        return CryptoJS.SHA256('' + signString).toString();
    }

    static md5(key: string): string {
        return CryptoJS.MD5(key).toString();
    }

    constructor() {
    }
}
