import {combineReducers}  from "@reduxjs/toolkit";
import userslice from "./userslice";
import themeslice from "./theme";
import postslice from "./postslice";

const rootReducer = combineReducers({
    user:userslice,
    theme:themeslice,
    posts:postslice
});


export  {rootReducer};