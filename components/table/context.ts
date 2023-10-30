import * as React from 'react';
import { createStore, useStore } from 'zustand';

export const createMyStore = () =>
    createStore<{
        count: number;
        inc: () => void;
    }>((set) => ({
        count: 0,
        inc: () => {
            // console.log('HERE')
            set((state) => ({ count: state.count + 1 }))
        }
    }));


export const MyContext = React.createContext<ReturnType<typeof createMyStore> | null>(null);

export const useMyStore = () => {
    const store = React.useContext(MyContext);
    if (store === null) {
        throw new Error("no provider");
    }
    // console.log('useStore(store)useStore(store)useStore(store)>>>', useStore(store));
    return useStore(store);
};