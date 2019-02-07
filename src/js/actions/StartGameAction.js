import * as types from "../constants/action-types";

export default function startGame(payload){
    return {
        type: types.START_GAME,
        payload
    };
}