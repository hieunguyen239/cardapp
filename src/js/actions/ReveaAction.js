import * as types from "../constants/action-types";

export default function reveal(payload){
    return {
        type: types.REVEAL,
        payload
    };
}