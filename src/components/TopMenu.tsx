import React from "react";
import { Menu, Icon } from 'antd'
import { Link } from 'react-router-dom'

export default class extends React.Component {
    render() {
        return (
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={["1"]}
                style={{ lineHeight: "64px" }}
                className="topMenu"
            >
                <Menu.Item key="1">
                    <Icon type="user" />
                    <span>                       
                        <Link to="/">主页</Link>
                    </span>
                </Menu.Item>
                <Menu.Item key="2">
                    <Icon type="setting" />
                    <span>
                        <Link to="/settings">设置</Link>
                    </span>
                </Menu.Item>
            </Menu>
        );
    }
}
