import { createAction, createReducer, current } from "@reduxjs/toolkit";
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

export const addPost = createAction<Post>("blog/addPost");
export const deletePost = createAction<string>("blog/deletePost");
export const startEditingPost = createAction<string>("blog/startEditingPost");
export const cancelEditingPost = createAction("blog/cancelEditingPost");
export const finishEditingPost = createAction<Post>("blog/finishEditingPost");

const blogReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(addPost, (state, action) => {
			const post = action.payload;
			state.postList.push(post);
		})
		.addCase(deletePost, (state, action) => {
			const postId = action.payload;
			state.postList = state.postList.filter((post) => post.id !== postId);
		})
		.addCase(startEditingPost, (state, action) => {
			const postId = action.payload;
			state.editingPost =
				state.postList.find((post) => post.id === postId) || null;
		})
		.addCase(cancelEditingPost, (state) => {
			state.editingPost = null;
		})
		.addCase(finishEditingPost, (state, action) => {
			const editedPost = action.payload;
			state.postList = state.postList.map((post) => {
				if (post.id === editedPost.id) {
					return editedPost;
				}
				return post;
			});
			state.editingPost = null;
		})
		.addMatcher(
			(action) => action.type.includes("cancel"),
			(state) => {
				console.log("Matcher: ", current(state));
			}
		);
});

export default blogReducer;
