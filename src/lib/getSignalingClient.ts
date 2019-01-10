import SignalingClient from "./SignalingClient";

let _instance: SignalingClient | null = null;
let _uid = null;
const APP_ID = (window as any).$$ENV.AGORA_APP_ID;
export default async function(
    uid: string | number,
    token?: string
): Promise<SignalingClient | null> {
    try {
        // 没有示例，创建实例

        // 客户端存在，并且登录状态为2
        if (_instance && _instance.session && _instance.session.state === 2) {
            return _instance;
        }

        const client = new SignalingClient(APP_ID);
        // 登录
        await client.login(uid, token);

        client.signal.setDoLog(true, "INFO");

        _instance = client;
        return _instance;
    } catch (err) {
        console.log("======登录信令", err);
        return null;
    }
}

function logoutClient() {
    const client = _instance;
    if (client) {
        return client.safeLogout();
    }
    return Promise.resolve();
}
