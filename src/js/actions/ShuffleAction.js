import * as types from "../constants/action-types";

export default function shuffle(payload){
    return {
        type: types.SHUFFLE,
        payload
    };
}