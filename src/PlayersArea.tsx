import * as React from "react";
import {
    Card, Elevation
} from "@blueprintjs/core";

interface PlayersAreaProps {
    players: any
}
interface PlayersAreaState {

}

export class PlayersArea extends React.PureComponent<PlayersAreaProps, PlayersAreaState> {
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
    

  public render() {
    return (
    <>
        <Card interactive={true} elevation={Elevation.TWO}>
            {this.props.players.map((player:any, id:number) => (
            <div key={id}>{player.name} with id [{player.id}]</div>
          ))}
        </Card>
    </>
    );
  }
}
