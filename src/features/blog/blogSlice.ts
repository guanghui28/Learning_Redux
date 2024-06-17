import { current, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "../../types/postType";
import { initialPostList } from "../../constants/blog";

interface BlogState {
	postList: Post[];
	editingPost: Post | null;
}

const initialState: BlogState = {
	postList: initialPostList,
	editingPost: null,
};

const blogSlice = createSlice({
	name: "blog",
	initialState,
	reducers: {
		addPost: (state, action: PayloadAction<Post>) => {
			const post = action.payload;
			state.postList.push(post);
		},
		deletePost: (state, action: PayloadAction<string>) => {
			const postId = action.payload;
			state.postList = state.postList.filter((post) => post.id !== postId);
		},
		startEditingPost: (state, action: PayloadAction<string>) => {
			const postId = action.payload;
			state.editingPost =
				state.postList.find((post) => post.id === postId) || null;
		},
		cancelEditingPost: (state) => {
			state.editingPost = null;
		},
		finishEditingPost: (state, action: PayloadAction<Post>) => {
			const editedPost = action.payload;
			state.postList = state.postList.map((post) => {
				if (post.id === editedPost.id) {
					return editedPost;
				}
				return post;
			});
			state.editingPost = null;
		},
	},
	extraReducers(builder) {
		builder.addMatcher(
			(action) => action.type.includes("cancel"),
			(state) => {
				console.log("Matcher: ", current(state));
			}
		);
	},
});

export const {
	addPost,
	deletePost,
	cancelEditingPost,
	startEditingPost,
	finishEditingPost,
} = blogSlice.actions;
export default blogSlice.reducer;
