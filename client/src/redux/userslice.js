import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(window?.localStorage.getItem("user")) || null, // Parse JSON instead of stringify
    edit: false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("user");
        },
        updateprofile: (state, action) => {
            state.edit = action.payload;
        }
    }
});


export default userSlice.reducer;

export function userlogin(user){
    return(dispatch,getState)=>{
        dispatch(userSlice.actions.login(user))
    }
} 


export function userlogout(){
    return(dispatch,getState)=>{
        dispatch(userSlice.actions.logout())
    }       
}
