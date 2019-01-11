import React from "react";
import CheckableTagList from "../public/CheckableTagList";
import { LOG_TYPES } from "../../constant/aroga";

interface IProps {
    onChange?: (checked:Array<string|number>) => any
}

export default class extends React.Component<IProps> {
    render() {
        return (
            <CheckableTagList
                checked={LOG_TYPES.map(d => d.value)}
                data={LOG_TYPES}
                onChange={this.props.onChange}
            />
        );
    }
}
