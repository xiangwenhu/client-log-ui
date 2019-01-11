import React from "react";
import CheckableTag from "./CheckableTag";
import { ITextValue } from "../../interface/Common";

interface IProps {
    data: Array<ITextValue>;
    checked?: Array<string | number>;
    onChange?: (checked: Array<string | number>) => any;
}

export default class extends React.Component<IProps> {
    state = {
        checked: this.props.checked || []
    };

    onChange = (checked: boolean, data: ITextValue) => {
        const checkedArr = this.state.checked;
        if (checked) {
            checkedArr.push(data.value);
        } else {
            const index = checkedArr.findIndex(d => d === data.value);
            checkedArr.splice(index, 1);
        }
        this.setState(
            {
                checked: checkedArr
            },
            () => {
                if (this.props.onChange) {
                    this.props.onChange(this.state.checked);
                }
            }
        );
    };

    getList = () => {
        const { data } = this.props;
        const { checked } = this.state;
        return data.map(d => {
            return (
                <CheckableTag
                    key={d.value}
                    checked={checked.includes(d.value)}
                    onChange={(checked: boolean) => this.onChange(checked, d)}
                >
                    {d.text}
                </CheckableTag>
            );
        });
    };

    render() {
        const { getList } = this;
        const content = getList();

        return content;
    }
}
