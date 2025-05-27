import {combineReducers} from "@reduxjs/toolkit";
import todosStateReducer from '../../features/TodoSlice.ts'


export const rootReducer = combineReducers({
    todosState: todosStateReducer
});