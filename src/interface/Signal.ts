export interface IClient {
    account: string;
    username?: string;
    status?: number;
}

export enum EnumMessageType {
    debug = 'debug',
    log = 'log',
    info = 'info',
    warn ='warn',
    error = 'error',
    other = 'other'
}

export interface IMessage {
    type?: EnumMessageType;
    account: number | string;
    app?: string;
    content: string;
    dateTime: string | Date;
}
