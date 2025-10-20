import { configureStore } from "@reduxjs/toolkit";
// import mcqsReducer from "../features/mcqs/mcqsSlice"
// import demoReducer from "../features/home/demoSlice"
import userReducer from "../features/user/userSlice"
import { apiSlice } from "./api";

export const store = configureStore({
    reducer:{
        [apiSlice.reducerPath]: apiSlice.reducer,
        // mcqs: mcqsReducer,
        // demo: demoReducer,
        user: userReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})