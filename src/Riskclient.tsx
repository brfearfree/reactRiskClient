import React from 'react';

import { Grid, Row, Col } from 'react-flexbox-grid';
import { Map } from './Map'
import { GameConsole } from './GameConsole'
import { TopPanel } from './TopPanel'
import { PlayersArea } from './PlayersArea'

import logo from './logo.svg';
import './App.css';
import { Spinner } from '@blueprintjs/core';

import SockJS from 'sockjs-client';
// @ts-ignore
import Stomp from 'stomp-websocket';
import { getScenarioData, sendMyName } from './javaapi';


interface riskclientProps {
}

interface riskclientState {
  loaded: boolean
  areas: Array<any>
  logdata: Array<string>
  players: Array<any>
  
  selectedAreaId: number
  targetAreas: Array<number>
  sourceAreaId: string
  targetAreaName: string
  targetAreaId: number

  game_id: string
  last_message_id: string
  player_id: string
  active_player: string
  current_phase: string

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
      targetAreaId: 999,
      targetAreaName: "click-on-map",

      strCurrentlyUsed: "0",
      selectedAreaId: 999,
      targetAreas: [],
      

      last_message_id: "",

      areas:[]
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
    var socket = new SockJS('/gs-guide-websocket');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame:any) => {
        this.stompClient.subscribe('/topic/greetings', (d:any) => {
            const txt = JSON.parse(d.body).content;

            /*
            const newGameState:any = JSON.parse(d.body).game;
            this.setState({
              areas: newGameState.areas,
              players: newGameState.players,
              current_phase: newGameState.currentPhase,
            });

            this.showGreeting(txt);
            */

            this.log_communication(' < GREETING: ' + txt);
        });
    });
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

  server_sendName_old = (name:string) => {
    this.stompClient.send("/app/hello", {}, JSON.stringify({'name': name}));
    this.log_communication(' > NAME: '+name);
  }
  server_sendName = (name:string) => {
    sendMyName(name).then((data:any) => {
      if(data.game.id){
        this.stompClient.subscribe('/topic/game/' + data.game.id + '/actions', (d:any) => {
          const newAction = JSON.parse(d.body);
          this.doAction(newAction.player, newAction.action, newAction.area, '', 0);
          if(newAction.effects){
            this.applyEffects(newAction.effects);
          }
          this.log_communication(' < '+newAction.playerId+': ACTION['+newAction.action+']: area[' + newAction.area+'], targetArea['+newAction.targetArea+'], units['+newAction.units+'],');
        });

        this.stompClient.subscribe('/topic/game/' + data.game.id + '/greetings', (d:any) => {
          const greeting = JSON.parse(d.body);
          this.log_communication(' < Player joined [' + greeting.name + '] [ '+ greeting.playersNow +' / ' + greeting.playersNeed + ']');
        });

        this.log_communication(' < Game State [' + data.game.id + ']');

        this.setState({
          areas: data.game.areas,
          players: data.game.players,
          current_phase: data.game.currentPhase,
          game_id: data.game.id
        });
      }
    });

    this.log_communication(' > NAME: '+name);
  }
  server_sendAction = (action:string, area:string, target_area: string, units: number) => {
    this.log_communication(' > '+this.state.player_id+': ACTION['+action+']: area['+area+'] target_area['+target_area+'] units['+units+']');
    this.stompClient.send("/app/do/" + this.state.game_id, {}, JSON.stringify({'playerId':this.state.player_id, 'action': action, 'area': area, 'targetArea':target_area, 'units':units}));
  }

  saveMap = (name:string) => {
    this.log_communication(' > SAVE MAP');
    this.stompClient.send("/app/savemap", {}, JSON.stringify({"areas":this.state.areas, "name":name}));
  }
  loadMap = (name:string) => {
    this.log_communication(' > LOAD MAP');

    getScenarioData(name).then((data:any)=>{
      console.log(data);
      if(data.areas && data.areas.length>0){
        this.setState({areas:data.areas});
      }
    });
    
    /*
    var data:any = this.stompClient.send("/app/loadmap", {}, JSON.stringify({"value":name}));
    console.log(data);
    if(data.areas && data.areas.length>0){
      this.setState({areas:data.areas});
    }
    */
  }

  setUserName = (name:string) => {
    this.setState({player_id:name});
    this.server_sendName(name);
  }

  applyEffects(effects:any){
    effects.forEach((effect:any, index:number) => {
      if(effect.action == 'updateAreaStr'){
        const newAreas = this.state.areas.slice();
        newAreas[effect.areaID].str = parseInt(effect.newValue);
        this.setState({areas:newAreas});
      }
    });
  }
  /* handle area click for scenario editor */
  handleAreaClick = (idx:number, str:string) => {
    if(this.state.selectedAreaId == idx){
      const newLinks = this.state.targetAreas;
      const areas = this.state.areas.slice();
      areas[this.state.selectedAreaId].links = newLinks;
      this.setState({
        "sourceAreaId":"",
        "strCurrentlyUsed": "0",
        "selectedAreaId": 999,
        "areas":areas,
        "targetAreas":[],
      });
    }
    else if(this.state.selectedAreaId == 999){
      this.setState({
        "sourceAreaId":"area"+idx,
        "strCurrentlyUsed": str,
        "selectedAreaId": idx,
        "targetAreas":(this.state.areas[idx].links?this.state.areas[idx].links:[])
      });
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

  /* handle area click for game editor */
  handleGameAreaClick = (idx:number, str:string) => {
    if(this.state.selectedAreaId == idx){
      const newLinks = this.state.targetAreas;
      const areas = this.state.areas.slice();
      areas[this.state.selectedAreaId].links = newLinks;
      this.setState({
        "sourceAreaId":"",
        "strCurrentlyUsed": "0",
        "selectedAreaId": 999,
        "areas":areas,
        "targetAreas":[],
        "targetAreaName":"",
        "targetAreaId":999,
      });
    }
    else if(this.state.selectedAreaId == 999){
      this.setState({
        "sourceAreaId":"area"+idx,
        "strCurrentlyUsed": str,
        "selectedAreaId": idx,
        "targetAreas":(this.state.areas[idx].links?this.state.areas[idx].links:[]),
        "targetAreaName":"",
        "targetAreaId":999,
      });
    }
    else{
      const linked = this.state.targetAreas.slice();
      if(linked.includes(idx)){
        // valid target

        this.setState({
          "targetAreaName":"area"+idx,
          "targetAreaId":idx,
        });
      }
    }
  }


  render(){

    let mapArea;
    let consoleArea;
    let TopPanelArea;
    let playersArea;

    if(this.state.loaded){
      mapArea = (
         <Map
            areas={this.state.areas}
            handleAreaClick={this.state.player_id?this.handleGameAreaClick:this.handleAreaClick}
            selectedArea={this.state.selectedAreaId}
            targetAreas={this.state.targetAreas}
            targetAreaId={this.state.targetAreaId}
         />
      );
      consoleArea = (
        <GameConsole
          recentEvents={this.state.logdata}
          sendAction={this.server_sendAction}
          setName={this.setUserName}
          sourceAreaId={this.state.selectedAreaId}
          targetAreaId={this.state.targetAreaId}
          targetAreaName={this.state.targetAreaName}
          strUsed={this.state.strCurrentlyUsed}
          saveMap={this.saveMap}
          loadMap={this.loadMap}
          playerid={this.state.player_id}
        />
      );
      TopPanelArea = (
        <TopPanel
          yourName={this.state.player_id}
          activePlayer={this.state.active_player}
          currentPhase={this.state.current_phase}
        />
      );

      playersArea = (
        <PlayersArea
          players={this.state.players}
        />
      )
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

      playersArea = (
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
        <Row>
          <Col xs={1} />
          <Col xs={11}>
            {playersArea}
          </Col>
        </Row>
      </Grid>
  </div>
    );
  }
}

export default Riskclient;
