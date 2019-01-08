import AgoraRTCClient from './AgoraRTCClient'

let _instance: AgoraRTCClient | null = null
const APP_ID = (window as any).$$ENV.AGORA_APP_ID

export default async function () {

    try {
        if (_instance) {
            return _instance
        }

        const client = new AgoraRTCClient(APP_ID)
        // 初始化
        await client.init()
        _instance = client
        return client
    } catch (err) {
        return null
    }
    
}


