import React from "react";
import { Layout, Icon } from "antd";
import { observer, inject } from "mobx-react";
import TopMenu from "../components/TopMenu";
import Views from "./Views";
import { IAuthStore } from "../stores/authStore";

const { Header, Sider, Content } = Layout;

interface IProps {
    authStore?: IAuthStore;
}

@inject("authStore")
@observer
export default class MainView extends React.Component<IProps> {
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
                className="horizontal"
            >
                <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
                    <div className="logo" />
                    <TopMenu />
                    <a
                        href="javascript:void(0)"
                        style={{
                            position: "absolute",
                            right: 52,
                            top: 0
                        }}
                        onClick={onLogout}
                    >
                        Logout
                    </a>
                </Header>
                <Content
                    style={{
                        padding: "0 50px",
                        marginTop: 64,
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            padding: 24,
                            flex: "1 0 380px"
                        }}
                    >
                        <Views />
                    </div>
                </Content>
            </Layout>
        );
    }
}
