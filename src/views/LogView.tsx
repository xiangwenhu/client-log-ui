import React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import getSignalingClient from "../lib/getSignalingClient";
import SignalingClient from "../lib/SignalingClient";
import { ADMIN_ID, CHANNEL_ID } from "../constant/aroga";
import { message } from "antd";
import { getJSON } from "../util/common";
import { IMessage } from "../interface/Signal";
import MessageList from '../components/log/MessageList'

interface IPathParams {
    account: string;
}
type IProps = RouteComponentProps<IPathParams>;

interface IState {
    messages: IMessage[];
}

export default withRouter(
    class extends React.Component<IProps, IState> {
        state = {
            messages: []
        };

        client?: SignalingClient = undefined;

        async componentDidMount() {
            const client = await getSignalingClient(ADMIN_ID, undefined);
            if (client) {
                this.client = client;
                await this.client.leave();
                await this.client.join(CHANNEL_ID);
                this.registerEvents();
                window.addEventListener("beforeunload", this.leave);
            }
            console.log("log view:", this.props);
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
                return this.client.leave();
            }
            return Promise.resolve();
        };

        registerEvents = () => {
            if (this.client) {
                this.queryUserList();
                // 监听客服端离开
                this.client.channelEmitter.on(
                    "onChannelUserLeaved",
                    this.onChannelUserLeaved
                );
                this.client.channelEmitter.on(
                    "onMessageInstantReceive",
                    this.onMessageInstantReceive
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
                messages: [...this.state.messages, message]
            });
        };

        queryUserList = async () => {
            if (this.client) {
                const res: { list: any[] } = await this.client.queryUserList();
            }
        };

        goBack = async () => {
            await this.leave();
            this.props.history.goBack();
        };

        render() {
            const { goBack } = this;
            return (
                <React.Fragment>
                    <div>
                        客户端日志
                        <a
                            href="javascript:;"
                            onClick={goBack}
                            style={{ float: "right" }}
                        >
                            返 回
                        </a>
                    </div>
                    <MessageList />
                </React.Fragment>
            );
        }
    }
);
