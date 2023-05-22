import { Action } from "./action-types";
import { IState } from "../types";
import { produce } from "immer";

export const initialState: IState = {
    visibleKeys: [],
}

export const reducer = produce(
    (draft: IState, action: Action) => {
        switch(action.type) {

            case 'SET_VISIBLE_KEYS': {
                break;
            }

            default:
                break;
        }
    }
);