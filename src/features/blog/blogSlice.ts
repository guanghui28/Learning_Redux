import {
	createSlice,
	PayloadAction,
	createAsyncThunk,
	AsyncThunk,
} from "@reduxjs/toolkit";
import type { Post } from "../../types/postType";
import http from "../../utils/http";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

type PendingAction = ReturnType<GenericAsyncThunk["pending"]>;
type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;
type FulfilledAction = ReturnType<GenericAsyncThunk["fulfilled"]>;

interface BlogState {
	postList: Post[];
	editingPost: Post | null;
	loading: boolean;
	currentRequestId: undefined | string;
}

const initialState: BlogState = {
	postList: [],
	editingPost: null,
	loading: false,
	currentRequestId: undefined,
};

export const getPostList = createAsyncThunk(
	"post/getPostList",
	async (_, thunkAPI) => {
		const res = await http.get<Post[]>("/posts", {
			signal: thunkAPI.signal,
		});

		return res.data;
	}
);

export const addPost = createAsyncThunk(
	"post/addPost",
	async (body: Post, thunkAPI) => {
		const res = await http.post<Post>("/posts", body, {
			signal: thunkAPI.signal,
		});

		return res.data;
	}
);

export const updatePost = createAsyncThunk(
	"post/updatePost",
	async (body: Post, thunkAPI) => {
		const res = await http.put<Post>(`/posts/${body.id}`, body, {
			signal: thunkAPI.signal,
		});
		return res.data;
	}
);

export const deletePost = createAsyncThunk(
	"post/deletePost",
	async (postId: string, thunkAPI) => {
		const res = await http.delete<Post>(`/posts/${postId}`, {
			signal: thunkAPI.signal,
		});
		return res.data;
	}
);

const blogSlice = createSlice({
	name: "blog",
	initialState,
	reducers: {
		startEditingPost: (state, action: PayloadAction<string>) => {
			const postId = action.payload;
			state.editingPost =
				state.postList.find((post) => post.id === postId) || null;
		},
		cancelEditingPost: (state) => {
			state.editingPost = null;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getPostList.fulfilled, (state, action) => {
				state.postList = action.payload;
			})
			.addCase(addPost.fulfilled, (state, action) => {
				state.postList.push(action.payload);
			})
			.addCase(updatePost.fulfilled, (state, action) => {
				const editedPost = action.payload;
				state.postList = state.postList.map((post) => {
					if (post.id === editedPost.id) {
						return editedPost;
					}
					return post;
				});
				state.editingPost = null;
			})
			.addCase(deletePost.fulfilled, (state, action) => {
				const postIdToDelete = action.payload.id;
				state.postList = state.postList.filter(
					(post) => post.id !== postIdToDelete
				);
			})
			.addMatcher<PendingAction>(
				(action) => action.type.endsWith("/pending"),
				(state, action) => {
					state.loading = true;
					state.currentRequestId = action.meta.requestId;
				}
			)
			.addMatcher<RejectedAction | FulfilledAction>(
				(action) =>
					action.type.endsWith("/rejected") ||
					action.type.endsWith("/fulfilled"),
				(state, action) => {
					if (
						state.loading &&
						state.currentRequestId === action.meta.requestId
					) {
						state.loading = false;
						state.currentRequestId = undefined;
					}
				}
			);
	},
});

export const { cancelEditingPost, startEditingPost } = blogSlice.actions;
export default blogSlice.reducer;
