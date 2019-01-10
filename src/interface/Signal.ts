export interface IClient {
    account: string;
    username?: string;
    status?: number;
}

export enum EnumMessageType {
    log,
    info,
    error,
    warn,
    other
}

export interface IMessage {
    type?: EnumMessageType;
    account: number | string;
    app?: string;
    content: string;
    dateTime: string | Date;
}
