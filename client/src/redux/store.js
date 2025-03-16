import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice.js';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTransform } from 'redux-persist';


const expireTransform = createTransform(
  (inboundState, key) => {
    return { ...inboundState, _persistTimestamp: Date.now() };
  },
  (outboundState, key) => {
    if (outboundState) {
      const expirationTime =  10800 * 1000; //12hr
      const isExpired = Date.now() - outboundState._persistTimestamp > expirationTime;
      if (isExpired) {
        return {
          currentUser: null,
          error: null,
          loading: false,
          theme: 'light'
        }; 
      }
    }
    return outboundState;
  }
);

const rootReducer = combineReducers({
    user: userReducer,
});

const persistConfig = {
    key: 'root',
    storage, 
    version: 1,
    transforms: [expireTransform],
}
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  
})

export const persistor = persistStore(store);