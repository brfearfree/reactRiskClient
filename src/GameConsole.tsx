import * as React from "react";
import {
    Button, FormGroup, ControlGroup, InputGroup, Card, Elevation
} from "@blueprintjs/core";

interface GameConsoleProps {
    recentEvents?: any
    sendAction: any
    setName: any
    sourceAreaId: number
    targetAreaId: number
    targetAreaName: string
    strUsed: string
    saveMap: any
    loadMap: any
    playerid: string
}
interface GameConsoleState {
    myName: string
    action: string
    mainAreaId: string
    targetAreaId: string
    unitsUsed: string
    scenarioName: string
}


export class GameConsole extends React.PureComponent<GameConsoleProps, GameConsoleState> {
    constructor(props:any) {
        super(props);
        this.state = {
            myName: "",
            action: "",
            mainAreaId: "",
            targetAreaId: "",
            unitsUsed: "0",
            scenarioName: ""
        };
    }    

    handleMyNameChange = (event:any) => {
        this.setState({myName:event.target.value});
    }
    handleScenarioNameChange = (event:any) => {
      this.setState({scenarioName:event.target.value});
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
        this.props.sendAction(this.state.action, this.props.sourceAreaId.toString(), this.props.targetAreaId.toString(), this.state.unitsUsed);
    }
    handleNameClick = (event:any) => {
        this.props.setName(this.state.myName);
    }

    handleBasicChange = (event:any) => {
      
    }
    handleMapSave = (event:any) => {
      this.props.saveMap(this.state.scenarioName);
    }
    handleMapLoad = (event:any) => {
      this.props.loadMap(this.state.scenarioName);
    }
    
    

  public render() {

    let greetingsBlock = (
      <></>
    );

    let scenariosBlock= (
      <></>
    );
    let actionsBlock= (
      <></>
    );

    if(!this.props.playerid){
      greetingsBlock = (
      <>
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
      </>
      );

      scenariosBlock = (
        <>
        <FormGroup
          label="Scenario name"
          labelFor="text-input"
          inline={true}
        >
          <ControlGroup
            fill={true}
            vertical={false}
          >
            <InputGroup placeholder="a-zA-Z" 
              style={{ width:"9em" }}
              onChange={this.handleScenarioNameChange}
            />
          </ControlGroup>
        </FormGroup>
        <Button
          icon="arrow-left"
          text="Save Map"
          onClick={this.handleMapSave}
          />
        <Button
          icon="arrow-left"
          text="Load Map"
          onClick={this.handleMapLoad}
          />
      </>
      );
    }
    else{
      actionsBlock = (
        <>
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
                    value={this.props.sourceAreaId.toString()}
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
                    value={this.props.targetAreaId.toString()}
                    onChange={this.handleBasicChange}
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
                    value={this.state.unitsUsed}
                  />
                </ControlGroup>
              </FormGroup>
              <Button
                icon="arrow-left"
                text="Send"
                onClick={this.handleClick}
                />
        </>
      );
    }

    return (
    <>
        <Card interactive={true} elevation={Elevation.TWO}>
            <br/>
            {greetingsBlock}
            {actionsBlock}
            {scenariosBlock}
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
