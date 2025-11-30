import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import profileFormReducer from './slices/profileFormSlice';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { rozeniteDevToolsEnhancer } from '@rozenite/redux-devtools-plugin';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'auth', 'profileForm'],
};

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  profileForm: profileFormReducer,
});

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
