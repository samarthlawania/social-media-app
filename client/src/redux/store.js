import {configureStore} from "@reduxjs/toolkit"
import {rootReducer} from "./reducer"


const store = configureStore({
    reducer:rootReducer,
})

const {dispatch} = store;// function to provide by redux to allow dispatching


export {store,dispatch}