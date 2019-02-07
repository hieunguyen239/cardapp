import {START_GAME, SHUFFLE, DRAW, REVEAL,END_ROUND , NEW_ROUND}  from "../constants/action-types";

const initialState = {
    is_running: false,
    is_ending: false,
    totalBet: 20000,
    deck_id: null,
    round: 1,
    status: false,
    is_shuffle: false,
    all_draw: false,
    is_reveal: false,
    is_new_round: false,
    playerData: []
};

export default function todos(state = initialState, action) {
    switch (action.type) {
        case START_GAME:
            return Object.assign({}, state, action.payload);
        case SHUFFLE:
            let shuffleState = Object.assign({}, state, action.payload);
            shuffleState.is_shuffle = action.payload;
            return shuffleState;
        case DRAW:
            let drawState = Object.assign({}, state, action.payload);
            drawState.all_draw = action.payload.all_draw;
            drawState.playerData = action.payload.playerData
            return drawState;
        case REVEAL:
            let revealtate = Object.assign({}, state, action.payload);
            revealtate.is_reveal = action.payload.is_reveal;
            revealtate.playerData = action.payload.playerData;
            return revealtate;
        case END_ROUND:
            let endRoundtate = Object.assign({}, state, action.payload);
            endRoundtate.is_ending = action.payload.is_ending;
            endRoundtate.is_running = action.payload.is_running;
            endRoundtate.round = action.payload.round;
            endRoundtate.playerData = action.payload.playerData;
            return endRoundtate;
        case NEW_ROUND:
            let newRoundtate = Object.assign({}, state, action.payload);
            newRoundtate.is_new_round = action.payload.is_new_round;
            newRoundtate.round = action.payload.round;
            newRoundtate.is_shuffle = action.payload.is_shuffle;
            newRoundtate.all_draw = action.payload.all_draw;
            newRoundtate.is_reveal = action.payload.is_reveal;
            newRoundtate.playerData = action.payload.playerData;
            newRoundtate.is_winner = action.payload.is_winner;
            console.log(newRoundtate);
            return newRoundtate;
        default:
            return state;
    }
}