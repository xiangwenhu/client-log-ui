import React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import getSignalingClient from "../lib/getSignalingClient";
import SignalingClient from "../lib/SignalingClient";
import AgoraRTCClient from "../lib/AgoraRTCClient";
import getAgoraRTCClient from "../lib/getAgoraRTCClient";
import { ADMIN_ID, CHANNEL_ID } from "../constant/aroga";
import { message } from "antd";
import { getJSON } from "../util/common";
import { IMessage } from "../interface/Signal";
import MssageFilter from "../components/log/MessageFilter";
import MessageList from "../components/log/MessageList";

interface IPathParams {
    account: string;
}
type IProps = RouteComponentProps<IPathParams>;

interface IState {
    messages: IMessage[];
    filter?: Array<string | number>;
    remoteStreamId?: string | null;
}

export default withRouter(
    class extends React.Component<IProps, IState> {
        state = {
            messages: [],
            filter: [],
            remoteStreamId: null
        };

        client?: SignalingClient = undefined;
        rtcClient?: AgoraRTCClient = undefined;

        async componentDidMount() {
            const { account } = this.props.match.params;
            const client = await getSignalingClient(ADMIN_ID, undefined);
            if (client) {
                this.client = client;
                await this.client.leave();
                await this.client.join(CHANNEL_ID);
                window.addEventListener("beforeunload", this.leave);
            }
            const rtcClient = await getAgoraRTCClient();
            if (rtcClient) {
                this.rtcClient = rtcClient;
                await this.rtcClient.safeJoin(null, account, ADMIN_ID);
            }
            this.registerEvents();
        }

        componentWillUnmount() {
            this.leave();
        }

        leave = () => {
            if (this.client) {
                this.client.channelEmitter.removeListener(
                    "onChannelUserLeaved",
                    this.onChannelUserLeaved
                );
                this.client.sessionEmitter.removeListener(
                    "onMessageInstantReceive",
                    this.onMessageInstantReceive
                );
                return this.client.leave();
            }
            if (this.rtcClient) {
                this.rtcClient.safeLeave();
                this.rtcClient.channelEmitter.removeListener(
                    "stream-added",
                    this.clientOnStreamAdded
                );
                this.rtcClient.channelEmitter.removeListener(
                    "stream-subscribed",
                    this.clientOnStreamSubscribed
                );
            }
            return Promise.resolve();
        };

        registerEvents = () => {
            if (this.client) {
                // 监听客服端离开
                this.client.channelEmitter.on(
                    "onChannelUserLeaved",
                    this.onChannelUserLeaved
                );
                this.client.sessionEmitter.on(
                    "onMessageInstantReceive",
                    this.onMessageInstantReceive
                );
            }
            if (this.rtcClient) {
                this.rtcClient.channelEmitter.on(
                    "stream-added",
                    this.clientOnStreamAdded
                );
                this.rtcClient.channelEmitter.on(
                    "stream-subscribed",
                    this.clientOnStreamSubscribed
                );
            }
        };

        onChannelUserLeaved = (
            account: string | number,
            uid: string | number
        ) => {
            const { account: accountId } = this.props.match.params;
            // 如果是和你连接的用户已经离开
            if (accountId === account) {
                message.info(`${account}已经离开。。。。`, 3000, () => {
                    this.goBack();
                });
            }
        };

        onMessageInstantReceive = (
            account: string | number,
            uid: string | number,
            msg: any
        ) => {
            const message = getJSON(msg) as IMessage;
            this.setState({
                messages: [message, ...this.state.messages]
            });
        };

        clientOnStreamAdded = (evt: any) => {
            try {
                const rtcClient = this.rtcClient!;
                const stream = evt.stream;
                rtcClient.client.subscribe(stream, function(err: any) {
                    alert(`订阅流体服务异常，更多细节：${err.reason}`);
                });
            } catch (err) {
                console.log("rtc-error:订阅流体服务异常", err);
            }
        };

        clientOnStreamSubscribed = (evt: any) => {
            try {
                const stream = evt.stream;
                const streamId = stream.getId();
                console.log(
                    "Subscribe remote stream successfully: " + streamId
                );
                this.setState(
                    {
                        remoteStreamId: streamId
                    },
                    () => {
                        stream.play("agora_remote" + streamId);
                    }
                );
            } catch (err) {
                console.log(
                    "rtc-stream-sinscried:订阅流体服务回调处理异常，",
                    err
                );
            }
        };

        goBack = async () => {
            await this.leave();
            this.props.history.goBack();
        };

        getFilteredMessage = () => {
            const { messages, filter } = this.state;
            if (!filter || filter.length <= 0) {
                return messages;
            }
            return messages.filter((message: IMessage) => {
                return filter.includes(message.type as never);
            });
        };

        onFilterChange = (filter: Array<string | number>) => {
            this.setState({
                filter
            });
        };

        getRemoteStreamElements = () => {
            try {
                const { remoteStreamId } = this.state;
                return (
                    <div
                        className="remote_video"
                        id={`agora_remote${remoteStreamId}`}
                    />
                );
            } catch (err) {
                console.log("生成音频HTML元素失败", err);
                return null;
            }
        };

        render() {
            const { goBack, onFilterChange, getFilteredMessage } = this;
            const messages = getFilteredMessage();
            const remoteStreamElements = this.getRemoteStreamElements();

            return (
                <React.Fragment>
                    客户端日志
                    <a
                        href="javascript:;"
                        onClick={goBack}
                        style={{ float: "right" }}
                    >
                        返 回
                    </a>
                    <div className="log">
                        <div className="messages">
                            <MssageFilter onChange={onFilterChange} />
                            <MessageList messages={messages} />
                        </div>

                        <div id="agora_remote" className="video">
                            {remoteStreamElements}
                        </div>
                    </div>
                </React.Fragment>
            );
        }
    }
);
