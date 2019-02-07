import React from 'react';
import './css/card.css';
import card_unknown from './images/card_unknown.png'; 

const Card = (props) =>{
    const {cards} = props;
    const {reveal} = props;
    console.log(reveal);
    let rendered_html = '';
    if(reveal){
        rendered_html = cards.map(card => <li key={Math.random()} className="card"><img src={card.image} alt={card.code}/></li>)
    }else{
        rendered_html = cards.map(card => <li key={Math.random()} className="card"><img src={card_unknown} alt="card"/></li>)
    }
    return(
        <ul className="player-cards-list">
            {
                rendered_html
            }
        </ul>
    ) 
}

export default Card;