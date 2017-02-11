import * as React from "react";
import { Link, withRouter } from "react-router";

interface BootstrapLinkProps {
    to: string,
    onlyActiveOnIndex?: boolean,
    router?: any
}

interface BootstrapLinkState {

}

class BootstrapLinkComponent extends React.Component<BootstrapLinkProps, BootstrapLinkState> {

    public static defaultProps: any = {
        onlyActiveOnIndex: false
    };

    constructor(props: BootstrapLinkProps) {
        super(props);
    }

    render() {

        // This code taken from the Link.js source for react-router.
        let liClass = (this.props.router && this.props.router.isActive(this.props.to, this.props.onlyActiveOnIndex)) ? "active" : "";

        return <li className={liClass}><Link to={this.props.to}>{this.props.children}</Link></li>
    }
}

export const BootstrapLink = withRouter(BootstrapLinkComponent);