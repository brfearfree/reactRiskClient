import * as React from "react";
import {
    Button, FormGroup, ControlGroup, InputGroup, Card, Elevation
} from "@blueprintjs/core";

interface GameConsoleProps {
    recentEvents?: any
    sendAction: any
    setName: any
    sourceAreaId: string
    strUsed: string
}
interface GameConsoleState {
    myName: string
    action: string
    mainAreaId: string
    targetAreaId: string
    unitsUsed: string
}


export class GameConsole extends React.PureComponent<GameConsoleProps, GameConsoleState> {
    constructor(props:any) {
        super(props);
        this.state = {
            myName: "",
            action: "",
            mainAreaId: "",
            targetAreaId: "",
            unitsUsed: "0"
        };
    }    

    handleMyNameChange = (event:any) => {
        this.setState({myName:event.target.value});
    }

    handleActionChange = (event:any) => {
        this.setState({action:event.target.value});
    }
    handlemainAreaIdChange = (event:any) => {
        this.setState({mainAreaId:event.target.value});
    }
    handletargetAreaIdChange = (event:any) => {
        this.setState({targetAreaId:event.target.value});
    }
    handleunitsUsedChange = (event:any) => {
        this.setState({unitsUsed:event.target.value});
    }
    handleClick = (event:any) => {
        this.props.sendAction(this.state.action, this.props.sourceAreaId, this.state.targetAreaId, this.props.strUsed);
    }
    handleNameClick = (event:any) => {
        this.props.setName(this.state.myName);
    }

    handleBasicChange = (event:any) => {
      
    }

  public render() {


    return (
    <>
        <Card interactive={true} elevation={Elevation.TWO}>
            <br/>
            <FormGroup
                label="My Name:"
                labelFor="text-input"
                inline={true}
              >
                <ControlGroup
                  fill={true}
                  vertical={false}
                >
                  <InputGroup placeholder="Name?" 
                    style={{ width:"9em" }}
                    onChange={this.handleMyNameChange}
                  />
                </ControlGroup>
              </FormGroup>
              <Button
                icon="arrow-left"
                text="Set Name"
                onClick={this.handleNameClick}
                />
            <FormGroup
                label="Action:"
                labelFor="text-input"
                inline={true}
              >
                <ControlGroup
                  fill={true}
                  vertical={false}
                >
                  <InputGroup placeholder="Action" 
                    style={{ width:"9em" }}
                    onChange={this.handleActionChange}
                  />
                </ControlGroup>
              </FormGroup>
              <FormGroup
                label="Main area ID"
                labelFor="text-input"
                inline={true}
              >
                <ControlGroup
                  fill={true}
                  vertical={false}
                >
                  <InputGroup placeholder="area ID" 
                    style={{ width:"9em" }}
                    value={this.props.sourceAreaId}
                    onChange={this.handleBasicChange}
                  />
                </ControlGroup>
              </FormGroup>
              <FormGroup
                label="Target area ID"
                labelFor="text-input"
                inline={true}
              >
                <ControlGroup
                  fill={true}
                  vertical={false}
                >
                  <InputGroup placeholder="area ID" 
                    style={{ width:"9em" }}
                    onChange={this.handletargetAreaIdChange}
                  />
                </ControlGroup>
              </FormGroup>
              <FormGroup
                label="Units Used"
                labelFor="text-input"
                inline={true}
              >
                <ControlGroup
                  fill={true}
                  vertical={false}
                >
                  <InputGroup placeholder="1-100" 
                    style={{ width:"9em" }}
                    onChange={this.handleunitsUsedChange}
                    value={this.props.strUsed}
                  />
                </ControlGroup>
              </FormGroup>
              <Button
                icon="arrow-left"
                text="Send"
                onClick={this.handleClick}
                />
        </Card>
        <Card interactive={true} elevation={Elevation.TWO}>
            {this.props.recentEvents.map((text:any, id:number) => (
            <div key={id}>{text}</div>
          ))}
        </Card>
    </>
    );
  }
}
