import React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import getSignalingClient from "../lib/getSignalingClient";
import SignalingClient from "../lib/SignalingClient";
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
}

export default withRouter(
    class extends React.Component<IProps, IState> {
        state = {
            messages: [],
            filter: []
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
                this.client.sessionEmitter.removeListener(
                    "onMessageInstantReceive",
                    this.onMessageInstantReceive
                );
                return this.client.leave();
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

        goBack = async () => {
            await this.leave();
            this.props.history.goBack();
        };

        getFilteredMessage = () => {
            const { messages, filter } = this.state;
            if (!filter ||  filter.length <= 0) {
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

        render() {
            const { goBack, onFilterChange, getFilteredMessage } = this;
            const messages  = getFilteredMessage();
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
                    <MssageFilter onChange={onFilterChange} />
                    <MessageList messages={messages} />
                </React.Fragment>
            );
        }
    }
);
