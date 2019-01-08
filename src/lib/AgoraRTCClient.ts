import EventEmitter from 'eventemitter3'
import CodeError from '../util/CodeError'
import { removeAllListeners } from './util'

const { AgoraRTC } = window as any

export default class AgoraRTCClient {

    _appId: string
    client: any
    channelEmitter: any
    userId: string | null | number
    stream: any

    constructor(appId: string, config = { mode: "live", codec: "vp8" }) {
        this._appId = appId;
        this.client = AgoraRTC.createClient(config);
        this.channelEmitter = new EventEmitter();
        this.userId = null
        this.stream = null
    }

    init(): Promise<any> {
        return new Promise((resolve, reject) => {

            this.client.init(this._appId, () => {
                [
                    "stream-published",
                    "stream-added",
                    "stream-removed",
                    "stream-subscribed",
                    "peer-leave",
                    "mute-audio",
                    "unmute-audio",
                    "mute-video",
                    "unmute-video",
                    "client-banned",
                    "active-speaker",
                    "volume-indicator",
                    "liveStreamingStarted",
                    "liveStreamingFailed",
                    "lliveStreamingStopped",
                    "liveTranscodingUpdated",
                    "onTokenPrivilegeWillExpire",
                    "onTokenPrivilegeDidExpire",
                    "error",
                    "networkTypeChanged",
                    "recordingDeviceChanged",
                    "playoutDeviceChanged",
                    "cameraChanged",
                    "streamTypeChange"
                ].forEach(eventName => {
                    this.client.on(eventName, (ev: any) => {
                        try {
                            switch (eventName) {
                                case 'error':
                                    console.log('RTC Client Error', ev)
                                    //this.safeLeave()
                                    break
                                default: break
                            }
                            this.channelEmitter.emit(eventName, ev)
                        } catch (err) {
                            console.log(`${eventName}事件处理异常,${err}`)
                        }
                    })
                })
                resolve()

            }, (err: any) => {
                reject(new CodeError({
                    message: err.message || '语音初始化失败'
                }))
            });
        })
    }

    removeListener(eventName: string, fn: Function): void {
        if (typeof eventName === 'string' && typeof fn === 'function') {
            this.channelEmitter.removeListener(eventName, fn)
        }
    }

    removeAllListeners(eventName: string): void {
        if (typeof eventName === 'string') {
            this.channelEmitter.removeAllListeners(eventName)
        }
    }

    join(tokenOrKey = null, channel: string | number, uid: string | number): Promise<any> {
        const { client } = this

        return new Promise((resolve, reject) => {
            client.join(tokenOrKey, channel, uid, (userId: string | number | null) => {
                console.log('加入音频频道', channel)

                this.userId = userId
                resolve(userId as any)
            }, function (err: any) {
                reject(err)
            })
        })
    }

    startStream(audioId: string, elementSelector: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const { userId, client } = this
            const localStream = AgoraRTC.createStream({
                streamID: userId,
                audio: true,
                microphoneId: audioId,
                screen: false
            });

            this.stream = localStream

            /*
            localStream.on("accessAllowed", () => {

            }); */

            // The user has denied access to the camera and mic.
            localStream.on("accessDenied", () => {
                reject(new CodeError({
                    code: 4001,
                    message: '获取本地媒体失败'
                }))
            });

            localStream.init(() => {
                localStream.play(elementSelector);

                client.publish(localStream, (err: any) => {
                    try {
                        this.stopStream()
                        reject(new CodeError({
                            code: 5001,
                            message: '发布本地音频流失败' + err
                        }))
                    } catch (err) {
                        reject(new CodeError({
                            code: 5001,
                            message: '发布流失败，停止本地流异常'
                        }))
                    }
                });

                client.on('stream-published', function (evt: any) {
                    localStream.published = true
                    resolve();
                });

            }, function (err: any) {
                reject(new CodeError({
                    code: 4001,
                    message: '获取本地媒体失败'
                }))
            });

        })
    }

    restartStream(audioId: string, elementSelector: string): Promise<any> {
        if (!this.stream) {
            return Promise.resolve()
        }
        try {
            const { client } = this
            if (this.stream.isPlaying() && this.stream.stop) {
                this.stream.stop()
            }
            client.unpublish(this.stream)

            const el = document.querySelector(elementSelector)
            if (el) {
                el.innerHTML = ''
            }

        } catch (err) {
            console.log('RTC restartStream err', err)
            return Promise.reject()
        }
        return this.startStream(audioId, elementSelector)
    }


    stopStream(): void {
        try {
            if (this.stream) {
                const { client } = this
                this.stream.stop()
                if (this.stream.published) {
                    client.unpublish(this.stream)
                }
            }

        } catch (err) {
            console.log('停止流发生异常', err)
        }
    }

    leave(): Promise<any> {
        const { client } = this
        return new Promise((resolve, reject) => {
            client.leave(() => {
                console.log('离开音频频道', client.channel)
                removeAllListeners(this.channelEmitter)
                client.stream = null
                resolve()
            }, function (err: any) {
                reject(err)
            })
        })
    }

    safeJoin(tokenOrKey = null, channel: string | number, uid: string | number): Promise<any> {
        return this.leave().then(() => this.join(tokenOrKey, channel, uid))
    }

    safeLeave(): Promise<any> {
        this.stopStream()
        return this.leave()
    }

    // 允许音频
    enableAudio(): void {
        this.stream && this.stream.enableAudio()
    }

    // 关闭音频
    disableAudio(): void {
        this.stream && this.stream.disableAudio()
    }

    /**
     * 设置声音大小
     * @param {Number} number 
     */
    setAudioVolume(number: number): void {
        this.stream && this.stream.setAudioVolume(number)
    }

    /**
     * 设置音频输出
     * @param {String} deviceId 设备 ID，可以通过 getDevices 获得，设备的 kind 属性应该为 "audiooutput"
     */
    setAudioOutput(deviceId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.stream && this.stream.setAudioOutput(deviceId, resolve, (message: string) => reject(new CodeError({
                message
            })))
        })
    }

    /**
     * 获取当前音量
     */
    getAudioLevel(): void {
        return this.stream && this.stream.getAudioLevel()
    }

    /**
     * 切换媒体输入设备
     * @param {*} type 设备类型
     * @param {*} deviceId 设备id
     */
    switchDevice(type: string, deviceId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.stream && this.stream.switchDevice(type, deviceId, resolve, (message: string) => reject(new CodeError({
                message
            })))
        })
    }
}
