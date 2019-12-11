import * as React from "react";
import { Row, Col } from 'react-flexbox-grid';
import { Navbar, NavbarGroup, NavbarHeading, NavbarDivider, Alignment } from "@blueprintjs/core";


interface TopPanelProps {
    activePlayer: string
    currentPhase: string
    yourName: string
}

export class TopPanel extends React.PureComponent<TopPanelProps> {
  public render() {
    return (
        <Navbar>
            <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>Yout Name: {this.props.yourName}</NavbarHeading>
                <NavbarDivider />
                <NavbarHeading>Active Player: {this.props.activePlayer}</NavbarHeading>
                <NavbarDivider />
                <NavbarHeading>Current phase: {this.props.currentPhase}</NavbarHeading>
            </NavbarGroup>
        </Navbar>
    );
  }
}
