import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    posts: {}
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        createPost: (state, action) => {
            state.posts[action.payload.postId] = action.payload.postData;
        }
    }
});

export default postSlice.reducer;

export function setPosts(post) {
    return (dispatch) => {
        dispatch(postSlice.actions.createPost(post));
    };
}
