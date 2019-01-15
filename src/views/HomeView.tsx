import React from "react";
import { Redirect } from "react-router";
import getSignalingClient from "../lib/getSignalingClient";
import SignalingClient from "../lib/SignalingClient";
import { IClient } from "../interface/Signal";
import ClientList from "../components/clients/ClientList";
import { ADMIN_ID, CHANNEL_ID } from "../constant/aroga";

interface IState {
    clients: IClient[];
    isRedirect: boolean;
    redirectUrl: string | null;
}

export default class extends React.Component<{}, IState> {
    state = {
        clients: [],
        isRedirect: false,
        redirectUrl: null
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
            this.client.channelEmitter.removeListener(
                "onChannelUserJoined",
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
            // 监听客服端加入
            this.client.channelEmitter.on(
                "onChannelUserJoined",
                this.onChannelUserJoined
            );
        }
    };

    onChannelUserLeaved = (account: string | number, uid: string | number) => {
        this.queryUserList();
    };

    onChannelUserJoined = (account: string | number, uid: string | number) => {
        this.queryUserList();
    };

    onEnterLogPage = async (accountId: string | number) => {
        await this.leave();
        this.setState({
            isRedirect: true,
            redirectUrl: `/logs/${accountId}`
        });
    };

    queryUserList = async () => {
        if (this.client) {
            const res: { list: any[] } = await this.client.queryUserList();
            console.log(res);
            this.setState({
                clients: (res.list || [])
                    .map((user: any[]) => ({ account: user[0] } as IClient))
                    .filter((client: IClient) => client.account != ADMIN_ID)
            });
        }
    };

    render() {
        const { onEnterLogPage } = this;
        const { clients, isRedirect, redirectUrl } = this.state;

        return isRedirect ? (
            <Redirect push to={redirectUrl!} />
        ) : (
            <React.Fragment>
                <div>客户端列表</div>
                <ClientList clients={clients} onEnterLogPage={onEnterLogPage} />
            </React.Fragment>
        );
    }
}
