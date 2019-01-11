import React from "react";
import { Tag } from "antd";

const { CheckableTag } = Tag;

interface IProps {
    onChange?: (checked: boolean) => any;
    checked?: boolean;
}

export default class extends React.Component<IProps> {
    state = { checked: this.props.checked || false };

    onChange = (checked: boolean) => {
        this.setState({ checked }, () => {
            if (this.props.onChange) {
                this.props.onChange(checked);
            }
        });
    };

    render() {
        const { checked } = this.state;
        const { onChange } = this;
        const { children } = this.props;

        return (
            <CheckableTag checked={checked} onChange={onChange}>
                {children}
            </CheckableTag>
        );
    }
}
