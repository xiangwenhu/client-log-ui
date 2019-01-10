import React from 'react'
import { Menu, Icon } from 'antd'
import { Link } from 'react-router-dom'

export default class LeftMenu extends React.Component {

    render() {
        return (
            <Menu className='leftMenu' theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">
                    <Icon type="user" />                  
                    <span>  <Link to='/'>主页</Link></span>
                </Menu.Item>       
                <Menu.Item key="2">
                    <Icon type="setting" />
                    <span><Link to='/settings'>设置</Link></span>
                </Menu.Item>
            </Menu>
        )
    }
}