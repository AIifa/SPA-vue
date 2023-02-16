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
            console.log("modules/delMenu/changeDialog " + flag)
            store.commit('changeDialog', flag)
        }
    }
};