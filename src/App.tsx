import React from "react";
import { LocaleProvider, DatePicker, message } from "antd";
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from "antd/lib/locale-provider/zh_CN";
import { observer, inject } from "mobx-react";
import MainViewH from "./views/MainViewH"; // 菜单垂直
import MainViewV from "./views/MainViewV"; // 菜单水平
import "./App.css";
import LoginView from "./views/LoginView";
import { Router } from "react-router-dom";
import { createBrowserHistory, createHashHistory } from "history";
import { IAuthStore } from "./stores/authStore";

const history = createHashHistory(); //createBrowserHistory();

interface IProps {
    authStore?: IAuthStore;
}

@inject("authStore")
@observer
class App extends React.Component<IProps> {
    render() {
        const { authStore } = this.props;
        const content = authStore!.logined ? (
            <MainViewV  />
        ) : (
            <LoginView
                {...{
                    authStore
                }}
            />
        );

        return (
            <Router history={history}>
                <LocaleProvider locale={zhCN}>{content}</LocaleProvider>
            </Router>
        );
    }
}

export default App;
