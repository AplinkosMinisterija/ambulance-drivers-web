import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { CurrentTripIdReducer } from "./currentTrip/reducer";
import { OfflineReducer } from "./offline/reducer";
import { UserReducer } from "./user/reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "offline"]
};

const reducers = combineReducers({
  user: UserReducer.reducer,
  offline: OfflineReducer.reducer,
  currentTripId: CurrentTripIdReducer.reducer
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ serializableCheck: false })
  ]
});

let persistor = persistStore(store);

const reduxData = { store, persistor };

export default reduxData;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
