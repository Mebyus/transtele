import * as rtk from '@reduxjs/toolkit';

enum ConState {
    UNTOUCHED,
    WAITING,
    ESTABLISHED,
    FAILED,
}

const conSlice = rtk.createSlice({
    name: 'connection',
    initialState: ConState.UNTOUCHED,
    reducers: {
        create: () => {
            return ConState.WAITING;
        },
        open: () => {
            return ConState.ESTABLISHED;
        },
        fail: () => {
            return ConState.FAILED;
        },
    },
});

const store = rtk.configureStore({ reducer: conSlice.reducer });
const { create, open, fail } = rtk.bindActionCreators(conSlice.actions, store.dispatch);

function echoer() {
    console.log(store.getState());
}

store.subscribe(echoer);
create();
open();
fail();
