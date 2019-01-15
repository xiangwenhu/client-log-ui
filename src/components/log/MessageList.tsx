import React from "react";
import { IMessage } from "../../interface/Signal";
import CheckableTagList from "../public/CheckableTagList";

interface IProps {
    messages: IMessage[];
}

export default class extends React.Component<IProps> {
    private ref: React.RefObject<HTMLDivElement> = React.createRef();

    componentDidUpdate() {
        this.setScrollTop();
    }

    setScrollTop() {
        const el: HTMLDivElement = this.ref.current!;
        const clientHeight = el.clientTop;
        const scrollHeight = el.scrollHeight;
        const scrollTop = scrollHeight - clientHeight;
        el.scrollTop = screenTop;
    }

    getListContent = () => {
        const { messages } = this.props;
        return messages.map((message: IMessage, index: number) => {
            return (
                <p key={index}>
                    {message.dateTime} {message.type} {message.content}
                </p>
            );
        });
    };

    render() {
        const content = this.getListContent();
        return (
            <div
                style={{
                    height: "550px",
                    overflowY: "auto"
                }}
                ref={this.ref}
            >
                {content}
            </div>
        );
    }
}
