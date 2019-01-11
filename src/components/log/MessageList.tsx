import React from "react";
import { IMessage } from "../../interface/Signal";
import CheckableTagList from "../public/CheckableTagList";

interface IProps {
    messages: IMessage[];
}

export default class extends React.Component<IProps> {
    getListContent = () => {
        const { messages } = this.props;
        return messages.map((message: IMessage,index:number) => {
            return (
                <p key={index}>
                    {message.dateTime} {message.type} {message.content}
                </p>
            );
        });
    };

    render() {
        const content = this.getListContent();
        return <div style={{
            height:'650px',
            overflowY:'auto'
        }}>{content}</div>;
    }
}
