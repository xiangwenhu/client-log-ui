import { action, observable } from "mobx";
import BaseStore from "./baseStore";

export interface IAuthStoreValue {
    logined?: boolean;
    userName?: string | null;
    phone?: string | null;
}

export interface IAuthStore {
    logined: boolean;
    userName: string | null;
    phone: string | null;
    setAuth(auth: IAuthStoreValue): void;
}

export class AuthStore extends BaseStore {
    constructor(auth: IAuthStoreValue) {
        super();
        this.setAuth(auth);
    }

    @observable logined = false!;
    @observable userName: string | null = null;
    @observable phone: string | null = null;

    @action
    setAuth(auth: IAuthStoreValue): void {
        if (auth.logined === true || auth.logined === false) {
            this.logined = auth.logined;
        }
        if (auth.userName) {
            this.userName = auth.userName;
        }
        if (auth.phone) {
            this.phone = auth.phone;
        }
    }

    toJSON() {
        return {
            logined: this.logined,
            userName: this.userName,
            phone: this.phone
        };
    }
}
