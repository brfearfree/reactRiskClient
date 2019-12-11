import * as React from "react";
import {
    Button
} from "@blueprintjs/core";

import { Row, Col } from 'react-flexbox-grid';


interface MapProps {
    
}

export class Map extends React.PureComponent<MapProps> {
  /*
            <Button
                rightIcon="arrow-left"
                text="Preču Šabloni"
            />*/
      
  public render() {
    return (
<>
      <img src="map.jpg"/>
</>
    );
  }
}
