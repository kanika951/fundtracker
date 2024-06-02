import { legacy_createStore as createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import  storage  from 'redux-persist/lib/storage';
// import {createStore} from "redux";
import rootReducer from "./reducers/index";


const persistConfig={
    key:"persist-state",
    storage
}
const persistedReducer = persistReducer(persistConfig,rootReducer);

const store = createStore(persistedReducer);

export const persistor = persistStore(store);
export default store;