import { EnumMessageType } from "../interface/Signal";

export const ADMIN_ID = '999999';
export const CHANNEL_ID = '444444';

export const LOG_TYPES: Array<{ text: EnumMessageType; value: EnumMessageType }> = [{
    text:EnumMessageType.debug,
    value:EnumMessageType.debug
},{
    text:EnumMessageType.log,
    value:EnumMessageType.log
},{
    text:EnumMessageType.info,
    value:EnumMessageType.info
},{
    text:EnumMessageType.warn,
    value:EnumMessageType.warn
},{
    text:EnumMessageType.error,
    value:EnumMessageType.error
},{
    text:EnumMessageType.other,
    value:EnumMessageType.other
}];
