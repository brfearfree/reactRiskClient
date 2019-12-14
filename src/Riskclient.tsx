import React from 'react';

import { Grid, Row, Col } from 'react-flexbox-grid';
import { Map } from './Map'
import { GameConsole } from './GameConsole'
import { TopPanel } from './TopPanel'

import logo from './logo.svg';
import './App.css';
import { Spinner } from '@blueprintjs/core';

import SockJS from 'sockjs-client';
// @ts-ignore
import Stomp from 'stomp-websocket';



interface riskclientProps {
}

interface riskclientState {
  loaded: boolean
  areas: Array<any>
  logdata: Array<string>
  players: Array<any>
  
  selectedAreaId: number
  targetAreas: Array<number>

  game_id: string
  last_message_id: string
  player_id: string
  active_player: string
  current_phase: string

  sourceAreaId: string
  strCurrentlyUsed: string

}

class Riskclient extends React.Component<riskclientProps, riskclientState> {
  stompClient:any = null;

  constructor(props:any) {
    super(props);
    this.state = {
      loaded: false,
      players: [],
      logdata:["Log lines goes here","This is the first line"],
      
      game_id: "",
      player_id: "",
      active_player: "",
      current_phase: "",

      sourceAreaId: "click-on-map",
      strCurrentlyUsed: "0",
      selectedAreaId: 999,
      targetAreas: [],

      last_message_id: "",

      areas:[
        {"id":0,"x":42,"y":62, "str":12, "color":"red", "links":[]},
        {"id":1,"x":109,"y":62, "str":1, "color":"green", "links":[]},
        {"id":2,"x":277,"y":67, "str":3, "color":"green", "links":[]},
        {"id":3,"x":110,"y":145, "str":2, "color":"grey", "links":[]},
        {"id":4,"x":167,"y":124, "str":6, "color":"red", "links":[]},
        {"id":5,"x":229,"y":117, "str":6, "color":"red", "links":[]},
        {"id":6,"x":113,"y":208, "str":4, "color":"green", "links":[]},
        {"id":7,"x":185,"y":185, "str":4, "color":"green", "links":[]},
        {"id":8,"x":154,"y":263, "str":5, "color":"grey", "links":[]},
      
        {"id":9,"x":187,"y":295, "str":5, "color":"yellow", "links":[]},
        {"id":10,"x":210,"y":352, "str":5, "color":"yellow", "links":[]},
        {"id":11,"x":165,"y":385, "str":5, "color":"yellow", "links":[]},
        {"id":12,"x":197,"y":485, "str":5, "color":"yellow", "links":[]},
      
        {"id":13,"x":347,"y":90, "str":2, "color":"red"},
        {"id":14,"x":320,"y":145, "str":4, "color":"red"},
        {"id":15,"x":400,"y":85, "str":4, "color":"red"},
        {"id":16,"x":320,"y":250, "str":4, "color":"red"},
        {"id":17,"x":385,"y":200, "str":4, "color":"red"},
        {"id":18,"x":470,"y":170, "str":22, "color":"green"},
        {"id":19,"x":425,"y":257, "str":4, "color":"green"},
      
        {"id":20,"x":620,"y":115, "str":1, "color":"green"},
        {"id":21,"x":665,"y":80, "str":1, "color":"green"},
        {"id":22,"x":710,"y":100, "str":99, "color":"grey"},
        {"id":23,"x":646,"y":148, "str":2, "color":"blue"},
        {"id":24,"x":700,"y":170, "str":2, "color":"blue"},
        {"id":25,"x":770,"y":165, "str":2, "color":"blue"},
        {"id":26,"x":555,"y":225, "str":3, "color":"red"},
        {"id":27,"x":625,"y":220, "str":3, "color":"yellow"},
        {"id":28,"x":510,"y":310, "str":8, "color":"yellow"},
        {"id":29,"x":610,"y":325, "str":8, "color":"blue"},
        {"id":30,"x":685,"y":340, "str":2, "color":"blue"},
        {"id":31,"x":570,"y":105, "str":11, "color":"green"},
        
        {"id":32,"x":690,"y":430, "str":1, "color":"blue"},
        {"id":33,"x":755,"y":370, "str":2, "color":"grey"},
        {"id":34,"x":725,"y":470, "str":2, "color":"blue"},
        {"id":35,"x":760,"y":445, "str":2, "color":"blue"},
      
        {"id":36,"x":375,"y":325, "str":2, "color":"grey"},
        {"id":37,"x":430,"y":310, "str":2, "color":"grey"},
        {"id":38,"x":470,"y":360, "str":2, "color":"grey"},
        {"id":39,"x":445,"y":408, "str":2, "color":"grey"},
        {"id":40,"x":445,"y":520, "str":2, "color":"grey"},
        {"id":41,"x":540,"y":510, "str":2, "color":"grey"},
      
        {"id":42,"x":795,"y":505, "str":5, "color":"blue"}
      ]
    };
  }

  componentDidMount() {
    this.riskServerConnect();
  }

  showGreeting = (data:any) => {

  }

  doAction = (player: string, action: string, base_area_id: string, target_area_id: string, units_used: number) => {

  }

  riskServerConnect = () => {
    /*
    var socket = new SockJS('/gs-guide-websocket');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame:any) => {
        this.stompClient.subscribe('/topic/greetings', (d:any) => {
            const txt = JSON.parse(d.body).content;

            const newGameState:any = JSON.parse(d.body).gameState;
            this.setState({areas:newGameState.areas});

            this.showGreeting(txt);
            this.log_communication(' < GREETING: ' + txt);
        });
        this.stompClient.subscribe('/topic/actions', (d:any) => {
            const newAction = JSON.parse(d.body);
            this.doAction(newAction.player, newAction.action, newAction.area, '', 0);
            this.log_communication(' < '+newAction.playerId+': ACTION['+newAction.action+']: area[' + newAction.area+'], targetArea['+newAction.targetArea+'], units['+newAction.units+'],');
        });
    });*/
    this.setState({loaded: true});
  }

  riskServerDisconnect = () => {
    if (this.stompClient !== null) {
        this.stompClient.disconnect();
    }
  }

  log_communication = (txt: string) => {
    const dx = this.state.logdata.slice();
    dx.unshift(txt);
    this.setState({logdata:dx});
  }

  server_sendName = (name:string) => {
    this.stompClient.send("/app/hello", {}, JSON.stringify({'name': name}));
    this.log_communication(' > NAME: '+name);
  }
  server_sendAction = (action:string, area:string, target_area: string, units: number) => {
    this.log_communication(' > '+this.state.player_id+': ACTION['+action+']: area['+area+'] target_area['+target_area+'] units['+units+']');
    this.stompClient.send("/app/do", {}, JSON.stringify({'playerId':this.state.player_id, 'action': action, 'area': area, 'targetArea':target_area, 'units':units}));
  }

  setUserName = (name:string) => {
    this.setState({player_id:name});
    this.server_sendName(name);
  }

  handleAreaClick = (idx:number, str:string) => {
    if(this.state.selectedAreaId == idx){
      const newLinks = this.state.targetAreas;
      const areas = this.state.areas.slice();
      areas[this.state.selectedAreaId].links = newLinks;
      this.setState({"sourceAreaId":"", "strCurrentlyUsed": "0", "selectedAreaId": 999, "areas":areas, "targetAreas":[]});
    }
    else if(this.state.selectedAreaId == 999){
      this.setState({"sourceAreaId":"area"+idx, "strCurrentlyUsed": str, "selectedAreaId": idx, "targetAreas":(this.state.areas[idx].links?this.state.areas[idx].links:[])});
    }
    else{
      const linked = this.state.targetAreas.slice();
      if(linked.includes(idx)){
        for( var i = 0; i < linked.length; i++){ 
          if ( linked[i] === idx) {
            linked.splice(i, 1); 
          }
       }
      }
      else{
        linked.push(idx);
      }

      this.setState({targetAreas:linked});

    }
  }

  render(){

    let mapArea;
    let consoleArea;
    let TopPanelArea;

    if(this.state.loaded){
      mapArea = (
         <Map
            areas={this.state.areas}
            handleAreaClick={this.handleAreaClick}
            selectedArea={this.state.selectedAreaId}
            targetAreas={this.state.targetAreas}
         />
      );
      consoleArea = (
        <GameConsole
          recentEvents={this.state.logdata}
          sendAction={this.server_sendAction}
          setName={this.setUserName}
          sourceAreaId={this.state.sourceAreaId}
          strUsed={this.state.strCurrentlyUsed}
        />
      );
      TopPanelArea = (
        <TopPanel
          yourName={this.state.player_id}
          activePlayer={this.state.active_player}
          currentPhase={this.state.current_phase}
        />
      );
    }
    else{
      mapArea = (
        <>
          <Spinner/>
        </>
      );
      consoleArea = (
        <>
          <Spinner/>
        </>
      );
      TopPanelArea = (
        <>
          <Spinner/>
        </>
      );
    }

    return (
      <div className="App">
      <Grid fluid>
        <Row>
          <Col xs={1} />
          <Col xs={11}>
            {TopPanelArea}
          </Col>
        </Row>
        <Row>
          <Col xs={1}>
            <img src={logo} className="App-logo" alt="logo" />
          </Col>
          <Col xs={8}> 
            {mapArea}
          </Col>
          <Col xs={3}>
            {consoleArea}
          </Col>
        </Row>
      </Grid>
  </div>
    );
  }
}

export default Riskclient;
