import * as React from "react";
import { Area } from './Area'

interface MapProps {
  areas: Array<any>
  handleAreaClick: any
  selectedArea: number
  targetAreas: Array<number>
  targetAreaId: number
}

export class Map extends React.PureComponent<MapProps> {
  /*
            <Button
                rightIcon="arrow-left"
                text="Preču Šabloni"
            />*/
  
  mapRef: any;
  constructor(props:any) {
      super(props);
      this.mapRef = React.createRef();
  }  
/*
  componentDidUpdate() {
    this.updateCanvas();
  }
  updateCanvas = () => {
    const cva = this.mapRef.current.getContext('2d');
    cva.clearRect(0,0, cva.width, cva.height);
   

    if(this.props.targetAreas.length>0 && this.props.selectedArea!=999){
      this.props.targetAreas.forEach((areaId:number, index:number) => {
        cva.beginPath();
          cva.moveTo(this.props.areas[this.props.selectedArea].x+11, this.props.areas[this.props.selectedArea].y+19);
          cva.lineTo(this.props.areas[areaId].x+11,this.props.areas[areaId].y+19);
          cva.stroke();
      });
    }
  }    */
  public render() {
    return (
<div id={"mapID"}>
      <img src="map.jpg"/>
      <canvas ref={this.mapRef} width={857} height={600} className={"mainCanvas"} style={{"left":0, "top":0}}/>
      {this.props.areas.map((area:any, id:number) => (
      <Area
        key={"area"+id}
        color={area.color}
        x={parseInt(area.x)}
        y={parseInt(area.y)}
        str={parseInt(area.str)}
        areaId={parseInt(area.id)}
        handleClick={this.props.handleAreaClick}
        isSelected={(id==this.props.selectedArea)?true:false}
        isTargeted={this.props.targetAreas.includes(id)?true:false}
        isGameTargeted={(this.props.targetAreaId == id)?true:false}
        showLinksTo={(id==this.props.selectedArea)?this.props.targetAreas:[]}
        mainCanvas={this.mapRef}
        allAreas={this.props.areas}
      />
     ))}
</div>
    );

    return (
        <>
        </>
    );
  }
}
