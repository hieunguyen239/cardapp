import React from 'react';
import avatar from './images/avatar.png';
import './css/player.css';

import Card from '../Card/Card';

const Player = (props) =>{
    console.log(props);
    const {data} = props;
    const cards = data.cards;
    let {reveal} = props;
    //if(data.id === 'player_3') reveal = true;
    return(
            <div className={"player " + (data.is_winner ? "winner" : "") + (data.id === 'player_3' ? "main-palyer" : "")} id={data.id}>
                <figure>
                    <img src={avatar} alt={data.name}/>
                    <figcaption>
                        <strong className="player-name" >Name: {data.name}</strong>
                        <div className="player-info">
                            <strong>Winning Times: </strong><span>{data.winning_times}</span>
                        </div>
                    </figcaption>
                    {data.is_winner && <span className="winner-label">Winner</span>}
                </figure>
                <div className="player-cards">
                    {
                        <Card cards={cards} reveal={reveal}/>
                    }
                </div>
            </div>
    ) 
}

export default Player;