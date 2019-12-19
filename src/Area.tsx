import React from 'react';
import ReactDOM from 'react-dom';

interface AreaProps {
    key: any
    areaId: number
    color: string
    x: number
    y: number
    str: number
    handleClick: any
    isSelected: boolean
    isTargeted: boolean
    mainCanvas: any
    showLinksTo: Array<number>
    allAreas: Array<any>
    isGameTargeted: boolean
}

export class Area extends React.Component<AreaProps> {
    myRef: any;
    constructor(props:any) {
        super(props);
        this.myRef = React.createRef();
    }  
    componentDidMount() {
        this.updateCanvas();
    }
    componentDidUpdate() {
        this.updateCanvas();
    }

    hClick = (e:any) => {
        this.props.handleClick(this.props.areaId, this.props.str);
    }

    updateCanvas = () => {
        const ctx = this.myRef.current.getContext('2d');
        ctx.globalAlpha = 0.8;
        ctx.clearRect(0,0, 30, 30);

        if(this.props.isTargeted){
            if(this.props.isGameTargeted){
                ctx.fillStyle = "black";
            }
            else{
                ctx.fillStyle = "white";
            }
            ctx.fillRect(0, 0, 30, 30);
        }

        ctx.fillStyle = this.props.color
        //ctx.fillRect(this.props.x, this.props.y, 30, 30);

        ctx.arc(15, 15, 15, 0, 2 * Math.PI);
        ctx.fill();
        
        if(this.props.isSelected){
            ctx.stroke();
        }
        
        ctx.font = '11px serif #00ff00';

        let plus:number = 0;
        if(this.props.str>9){
            plus = 5;
        }
        else{
            plus = 8;
        }
        ctx.strokeText(this.props.str, 4+plus, 19);
    }

    render() {
        return (
            <canvas ref={this.myRef} width={30} height={30} className={"mapCanvas"} style={{"left":this.props.x, "top":this.props.y}} onClick={this.hClick}/>
        );
   }
}