import React from "react";
import { IClient } from "../../interface/Signal";
import { Table } from "antd";
import { Link } from 'react-router-dom'

interface IProps {
    clients: IClient[];
    onEnterLogPage: (accountId: string | number) => any;
}

export default class extends React.Component<IProps> {

    getColumns = () => {
        const {onEnterLogPage} = this.props
        return [
            {
                title: "账号ID",
                dataIndex: "account",
                key: "account"
            },
            {
                title: "操作",
                key: "action",
                dataIndex: "action",
                render: (text: string, record: IClient) => (
                    <span>
                        <a href="javascript:;" onClick={()=>onEnterLogPage(record.account)}>
                            连接
                        </a>
                    </span>
                )
            }
        ];
    };

    render() {
        const columns = this.getColumns();
        const { clients } = this.props;
        return (
            <Table rowKey="account" columns={columns} dataSource={clients} />
        );
    }
}
