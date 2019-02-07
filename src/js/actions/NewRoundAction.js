import * as types from "../constants/action-types";

export default function newRound(payload){
    console.log(payload);
    return {
        type: types.NEW_ROUND,
        payload
    };
}