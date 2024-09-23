import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import someReducer from "./someSlice"; // Replace this with your actual reducer

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  some: someReducer, // Replace with your reducers
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
