import React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import getSignalingClient from "../lib/getSignalingClient";
import SignalingClient from "../lib/SignalingClient";
import { ADMIN_ID, CHANNEL_ID } from "../constant/aroga";

interface IPathParams {
    account: string;
}
type IProps = RouteComponentProps<IPathParams>;

export default withRouter(
    class extends React.Component<IProps, {}> {
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
            console.log('log view:' ,this.props)
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
                this.client.leave();
            }
        };

        registerEvents = () => {
            if (this.client) {
                this.queryUserList();
                // 监听客服端离开
                this.client.channelEmitter.on(
                    "onChannelUserLeaved",
                    this.onChannelUserLeaved
                );
            }
        };

        onChannelUserLeaved = (
            account: string | number,
            uid: string | number
        ) => {
            this.queryUserList();
        };

        queryUserList = async () => {
            if (this.client) {
                const res: { list: any[] } = await this.client.queryUserList();
            }
        };

        render() {
            return (
                <React.Fragment>
                    <div>客户端日志</div>
                </React.Fragment>
            );
        }
    }
);
