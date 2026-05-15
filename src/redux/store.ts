import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import profileFormReducer from './slices/profileFormSlice';
import discoveryReducer from './slices/discoverySlice';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { rozeniteDevToolsEnhancer } from '@rozenite/redux-devtools-plugin';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'auth', 'profileForm'],
};

const combinedReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  profileForm: profileFormReducer,
  discovery: discoveryReducer,
  chat: chatReducer,
  notification: notificationReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_STORE') {
    // We clear the state by passing undefined to the combined reducer
    state = undefined;
    // We also need to clear AsyncStorage if needed, but per-slice resets usually suffice
    // except when Redux Persist re-hydrates. By setting state to undefined, 
    // the combined reducer will return the initial state for all slices.
  }
  return combinedReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(rozeniteDevToolsEnhancer()),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
