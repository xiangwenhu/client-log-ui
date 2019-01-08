import React from "react";
import { Layout, Icon } from "antd";
import { observer, inject } from "mobx-react";
import Image_LogDebug from "../images/log-debug.jpg";
import LeftMenu from "../components/LeftMenu";
import Views from "./Views";
import { IAuthStore } from "../stores/authStore";

const { Header, Sider, Content } = Layout;

interface IProps {
    authStore?: IAuthStore;
}

@inject("authStore")
@observer
export default class MainView extends React.Component<IProps> {
    state = {
        collapsed: false
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    };

    onLogout = () => {
        const { authStore } = this.props;
        if (authStore) {
            authStore.setAuth({
                logined: false,
                phone: null,
                userName: null
            });
        }
    };

    render() {
        const { onLogout } = this;

        return (
            <Layout
                style={{
                    height: "100%"
                }}
                className="vertical"
            >
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}
                >
                    <div className="logo">
                        <img src={Image_LogDebug} height="100%" width="100%" />
                    </div>
                    <LeftMenu />
                </Sider>
                <Layout>
                    <Header style={{ background: "#fff", padding: 0 }}>
                        <Icon
                            className="trigger"
                            style={{
                                marginLeft: 25
                            }}
                            type={
                                this.state.collapsed
                                    ? "menu-unfold"
                                    : "menu-fold"
                            }
                            onClick={this.toggle}
                        />
                        <a
                            href="javascript:void(0)"
                            style={{
                                position: "absolute",
                                right: 35
                            }}
                            onClick={onLogout}
                        >
                            Logout
                        </a>
                    </Header>
                    <Content
                        style={{
                            margin: "24px 16px",
                            padding: 24,
                            background: "#fff",
                            minHeight: 280
                        }}
                    >
                        <Views />
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
