import {EventEmitter, Injectable, isDevMode} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

export interface ErrorEventOptions {
    action?: string;
    message?: string;
    url?: string;
}
export class ErrorEvent {
    action?: string;
    message?: string;
    url?: string;

    constructor(options: ErrorEventOptions){
        if (options.action) {
            this.action = options.action;
        }
        if (options.message) {
            this.message = options.message;
        }
        if (options.url) {
            this.url = options.url;
        }
    }
}

@Injectable()
export class ErrorService {


    private ErrorMessage = {
        default: 'error.default',
        incorrect_public_key: 'error.incorrect_public_key',
        signature_verification_error: 'error.signature_verification_error',
        invalid_amount_error: 'error.invalid_amount_error',
        account_not_found: 'error.account_not_found',
        cant_transfer_in_same_account: 'error.cant_transfer_in_same_account',
        your_balance_is_not_enough: 'error.your_balance_is_not_enough',
        requested_account_doesnt_exist: 'error.requested_account_doesnt_exist',
        transfer_failed: 'error.transfer_failed',
        password_error: 'error.password_error',
        connection_error: 'error.connection_error',
        need_private_key: 'error.need_private_key',
        load_balance_error: 'error.load_balance_error',
        transactions_not_found: 'error.transactions_not_found',
        incorrect_recover_phrase: 'error.incorrect_recover_phrase',
        ins_invalid_amount_error: 'error.ins_invalid_amount_error',
        account_already_exist: 'error.account_already_exist',
        init_external_ws_service: 'error.init_external_ws_service',
        form_not_submitted: 'error.form_not_submitted',
        system_error: 'error.system_error',
        confirm_registration: 'error.confirm_registration',
        complete_registration: 'error.complete_registration',
        already_confirmed: 'error.already_confirmed'
    };


    public errorEventEmiter: EventEmitter<any> = new EventEmitter(true);

    constructor(private translateService: TranslateService) {
    }

    getError(key) {
        if(this.ErrorMessage[key]) {
            return this.translateService.instant(this.ErrorMessage[key]);
        } else {
            return this.translateService.instant(this.ErrorMessage["default"]);
        }
    }

    public handleError(action: string, error: any, url = '') {
        let errorMessage = '';
        if (error.error && error.error.message) {
            errorMessage = error.error.message;
        } else if (error.error) {
            errorMessage = error.error;
        } else if (error) {
            errorMessage = error;
        } else {
            errorMessage = 'Not_Found';
        }

        if (isDevMode()) {
            console.log(action, errorMessage, url);
        }
        let key = '';
        if (error) {
            if (error.status === 0) {
                key = 'connection_error';
            } else if (error.status === 404) {
                key = 'account_not_found';
            } else if (error.status === 409) {
                key = errorMessage;
            } else {
                key = 'default';
            }
        }
        let message = this.getError(key);

        let errorEvent = new ErrorEvent({action: action, message: message, url: url});

        this.errorEventEmiter.emit(errorEvent);
    }

}
