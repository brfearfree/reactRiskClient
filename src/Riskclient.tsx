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
  
  game_id: string
  last_message_id: string
  player_id: string
  active_player: string
  current_phase: string
}

class Riskclient extends React.Component<riskclientProps, riskclientState> {
  stompClient:any = null;

  constructor(props:any) {
    super(props);
    this.state = {
      loaded: false,
      areas: [],
      players: [],
      logdata:["Log lines goes here","This is the first line"],
      
      game_id: "",
      player_id: "",
      active_player: "",
      current_phase: "",

      last_message_id: ""
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
            this.showGreeting(txt);
            this.log_communication(' < GREETING: ' + txt);
        });
        this.stompClient.subscribe('/topic/actions', (d:any) => {
            const newAction = JSON.parse(d.body);
            this.doAction(newAction.player, newAction.action, newAction.area, '', 0);
            this.log_communication(' < '+newAction.playerId+': ACTION['+newAction.action+']: area[' + newAction.area+'], targetArea['+newAction.targetArea+'], units['+newAction.units+'],');
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

  render(){

    let mapArea;
    let consoleArea;
    let TopPanelArea;

    if(this.state.loaded){
      mapArea = (
         <Map

         />
      );
      consoleArea = (
        <GameConsole
          recentEvents={this.state.logdata}
          sendAction={this.server_sendAction}
          setName={this.setUserName}
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
