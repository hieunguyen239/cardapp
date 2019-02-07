import * as types from "../constants/action-types";

export default function draw(payload){
    return {
        type: types.DRAW,
        payload
    };
}