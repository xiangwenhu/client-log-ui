/**
 * 
 * @param {String} kind audioinput|audiooutput|videoinput|*
 */
export function getDevices(kind = '*') {

    const { AgoraRTC } = window as any
    if (!AgoraRTC || !AgoraRTC.getDevices) {
        return Promise.resolve([])
    }
    return new Promise((resolve, reject) => {
        AgoraRTC.getDevices((devices: Array<any> = []) => {
            const ds = devices.filter(device => {
                return kind === '*' ? true : device.kind === kind
            }).map(device => {
                return {
                    kind: device.kind,
                    label: device.label,
                    deviceId: device.deviceId
                }
            })
            resolve(ds)
        })
    })
}

export function removeAllListeners(emitter: any) {
    if (emitter && emitter.eventNames && emitter.removeAllListeners) {
        emitter.eventNames().forEach((eventName: string) => {
            emitter.removeAllListeners(eventName)
        })
    }
}
