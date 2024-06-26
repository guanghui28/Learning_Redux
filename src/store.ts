import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "./features/blog/blogSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
	reducer: {
		blog: blogReducer,
	},
});

// get RootState and AppDispatch from our store
// this purpose is served for Typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
