import React, {Component} from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import './css/board.css';
import Player from '../Player/Player';

import startGame from '../../js/actions/StartGameAction';
import shuffle from '../../js/actions/ShuffleAction';
import draw from '../../js/actions/ShuffleAction';
import reveal from '../../js/actions/ReveaAction';
import endRound from '../../js/actions/EndRoundAction';
import newRound from '../../js/actions/NewRoundAction';

class Board extends Component{
    constructor(props){
        super(props);
        this.doAction = this.doAction.bind(this);
    }
    

    calcCards = (cards) =>{
        let point = 0;

        if(cards){
            let isJackSpot = true; // All J, Q, K
            for(let i = 0 ; i < cards.length; i++ ){
                let value = cards[i].value;
                if(value.toLowerCase() === 'ace'){
                    value = 1;
                    isJackSpot = false;
                }else{
                    if(isNaN(value)){
                        value = 0; //j, Q, K
                    }else{
                        isJackSpot = false;
                    }
                }
                point += parseInt(value);
            }

            if(!isJackSpot){
                if(point >= 10)  point %= 10;
            }else{
                point = 999;
            }
        }

        return point;
    }

    chooseWinner(){
        const todos = this.props.todos;
        let players = todos.playerData;
        let pointData = [];
        if(players){
            players.forEach((player)=>{
                let cards = player.cards;
                let point = this.calcCards(cards);
                let playerInfo = {
                    player_id : player.id,
                    player_point: parseInt(point)
                }
                pointData.push(playerInfo);
            });
            
            let max = Math.max.apply(Math, pointData.map(function(o) { return o.player_point; }));
            let winners = [];
            for(var i =0; i < pointData.length ; i ++){
                let point = pointData[i].player_point;
                if(point === max){
                    winners.push(i);
                }
            }

            let totalBet = todos.totalBet;
            let playersCopy = JSON.parse(JSON.stringify(players));
            
            for(let i = 0; i < playersCopy.length; i++){
                if(winners.indexOf(i) >= 0){
                    let rewardPoint = totalBet / winners.length;
                    playersCopy[i].score = rewardPoint;
                    playersCopy[i].is_winner = true;
                    playersCopy[i].winning_times = playersCopy[i].winning_times + 1;
                }else{
                    playersCopy[i].score = parseInt(playersCopy[i].score) - 5000;
                    playersCopy[i].is_winner = false;
                    playersCopy[i].winning_times = playersCopy[i].winning_times - 1;
                }
            };
            this.props.reveal({
                is_reveal: true,
                playerData : playersCopy
            });

            if(todos.round === 5){
                let playerData = todos.playerData;
                let max = Math.max.apply(Math, playerData.map(function(o) { return o.winning_times; }));
                let winners = 'Congrat player: ';
                playerData.forEach((player) => {
                    if(player.winning_times === max){
                        winners += ' ' + player.name;
                    }
                });
                winners.trim();
                winners.replace(' ', winners, ' and ');
                alert(winners);
                this.props.endRound({
                    is_ending: true,
                    is_running: false,
                    round: 1,
                    playerData: []
                });
            }
        }
    }

    doAction = (e) =>{
        const clickId = e.target.id;
        const todos = this.props.todos;
        switch(clickId){
            case 'start-game':
                axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
                    .then(res => {
                        const desk = res.data;
                        let players = [];
                        for(let i = 0; i< 4; i++){
                            const id = "player_" + i;
                            const name = "Player " + i;
                            const playerData = {
                                id,
                                name,
                                cards: [],
                                score: 5000,
                                is_winner: false,
                                winning_times: 0
                            }
                            players.push(playerData);
                        }
                        this.props.startGame({
                            status : desk.success,
                            deck_id : desk.deck_id,
                            is_running: true, 
                            is_shuffle: false,
                            all_draw: false,
                            is_reveal: false,
                            is_new_round: false,
                            playerData: players
                        });
                });
            break;
            case  'shuffle':
                if(todos.deck_id != null){
                    axios.get(`https://deckofcardsapi.com/api/deck/${ todos.deck_id }/shuffle/`)
                        .then(res => {
                            const deck = res.data;
                            this.props.shuffle(deck.shuffled)
                        });
                }
            break;
            case 'draw':
                if(todos.deck_id != null){
                    const numberOfPlayer = 4;
                    let promises = [],
                        url = `https://deckofcardsapi.com/api/deck/${ todos.deck_id }/draw/?count=3`;

                    for(let i = 0; i < numberOfPlayer; i++){
                        promises.push(axios.get(url));
                    }
                    let playersData = [];
                    axios.all(promises)
                        .then(results => {
                            results.forEach((res, index) => {
                                const cards = res.data.cards,
                                    name = 'player ' + index,
                                    id = 'player_' + index;
                                const playerData = {
                                    id,
                                    name,
                                    cards: cards,
                                    score: todos.playerData[index].score,
                                    is_winner: false,
                                    winning_times: todos.playerData[index].winning_times
                                }
                                playersData.push(playerData);        
                            });
                            this.props.draw({
                                playerData: playersData,
                                all_draw: true
                            });
                        });
                    
                }
            break;
            case 'reveal':
                if(todos.deck_id != null && todos.all_draw){
                    this.chooseWinner();
                }
            break;
            case 'new-round':
                if(todos.deck_id != null && todos.is_reveal){
                    let playersCopy = JSON.parse(JSON.stringify(todos.playerData));
                    playersCopy.forEach(player => {
                        player.cards = [];
                        player.is_winner = false;
                    });
                    this.props.newRound({
                        is_new_round: true,
                        round: todos.round + 1,
                        is_shuffle: false,
                        all_draw: false,
                        is_reveal: false,
                        playerData:playersCopy
                    });
                }
            break;
            default :
            break;
        }
    }

    renderPlayers = () => {
        const todos = this.props.todos;
        let players = [];
        if(!todos.is_running){
            for(let i = 0; i< 4; i++){
                const id = "player_" + i;
                let name = "Player " + i;
                if(i === 3) name = "YOU";
                const playerData = {
                    id,
                    name,
                    cards: [],
                    score: 5000,
                    is_winner: false,
                    winning_times: 0
                }
               
                    playerData.is_reveal = true;
                players.push(playerData);
            }
        }else{
            players = todos.playerData;
        }
        //console.log(this.state.playerData);
        return players.map((data, index) => (
            <Player key={index} data={data} reveal={todos.is_reveal}/>
        ));
    }

    render = () =>{
        const todos = this.props.todos;
        const players = this.renderPlayers();
        return(
            <div className="container">
                <div>
                    {!todos.is_running && <button className = {"btn start"} id="start-game" onClick={this.doAction}>Start Game</button>}
                </div>
                {todos.status && todos.is_running && 
                    <div className="game-container">
                        <div className="deck-section">
                            <div className="round-number">Round {todos.round}</div>
                            {
                                players
                            }
                        </div>
                        <div className="deck-controls">
                            {!todos.is_shuffle && <button className={"btn shuffle"} id="shuffle" onClick={this.doAction}>Shuffle</button>}
                            {todos.is_shuffle && <button className={"btn draw " + (todos.all_draw ? "hidden" : "")} id="draw" onClick={this.doAction}>Draw</button>}
                            {todos.all_draw && !todos.is_reveal  && <button className="btn reveal" id="reveal" onClick={this.doAction}>Reveal</button>}
                            {todos.is_reveal  && <button className="btn new-round" id="new-round" onClick={this.doAction}>Next Round</button>}
                        </div>
                    </div>
                }
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        todos: state.boardReducer
    };
}

function mapDispatchToProps(dispatch) {
    return {
        //actions: bindActionCreators(TodoActions, dispatch)
        startGame: (payload)  => dispatch(startGame(payload)),
        shuffle: (payload)  => dispatch(shuffle(payload)),
        draw: (payload)     => dispatch(draw(payload)),
        reveal: (payload)     => dispatch(reveal(payload)),
        endRound: (payload)     => dispatch(endRound(payload)),
        newRound: (payload)     => dispatch(newRound(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);