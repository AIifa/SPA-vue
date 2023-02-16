export default {
    namespaced: true,
    state: {
        dialog: false,
    },
    getters: {
        dialog(state) {
            return state.dialog;
        }
    },
    mutations: {
        changeDialog(state, flag) {
            state.dialog = flag;
        }
    },
    actions: {
        changeDialog(store, flag) {
            console.log("modules/addMenu/changeDialog " + flag)
            store.commit('changeDialog', flag)
        }
    }
};