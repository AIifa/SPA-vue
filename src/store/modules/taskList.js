export default {
    namespaced: true,
    state: {
        taskList: [],
        count: 0
    },
    getters: {
        taskList(state) {
            return state.taskList;
        },
        count(state) {

            return state.count;
        },
    },
    mutations: {
        addNewTask(state, someText) {
            state.count += 1
            state.taskList.push({
                id: state.count,
                title: someText,
                subTaskList: [],
                performedList: []
            });

            localStorage.setItem("taskList", JSON.stringify(state.taskList));
            localStorage.setItem("count", state.count);
        },
        addNewSubTask(state, id) {
            let pos = state.taskList.map((el) => el.id).indexOf(id);
            console.log("modules/taskList/addNewSubTask/pos " + pos)
            if (pos !== -1) {
                console.log("modules/taskList/addNewSubTask/if " + pos)
                state.taskList[pos].subTaskList.push("New subtask");
            }

            localStorage.setItem("taskList", JSON.stringify(state.taskList));
        },
        delTask(state, id) {
            let pos = state.taskList.map((el) => el.id).indexOf(id);
            console.log("modules/taskList/delTask/pos " + pos)
            if (pos !== -1) {
                console.log("modules/taskList/delTask/if " + pos)
                state.taskList.splice(pos, 1);
            }

            localStorage.setItem("taskList", JSON.stringify(state.taskList));
        },
        delSubTask(state, payload) {
            let pos = state.taskList.map((el) => el.id).indexOf(payload.id);
            console.log("modules/taskList/delSubTask/pos " + pos)
            if (pos !== -1) {
                console.log("modules/taskList/delSubTask/if " + pos)
                state.taskList[pos].subTaskList.splice(payload.ind, 1);
                state.taskList[pos].performedList.splice(payload.ind, 1);
            }

            localStorage.setItem("taskList", JSON.stringify(state.taskList));
        },
        updateTaskList(state, payload) {
            let index = state.taskList.map((el) => el.id).indexOf(payload.id);
            console.log("modules/taskList/updateTaskList/pos " + index)
            if (index !== -1) {
                console.log("modules/taskList/updateTaskList/if " + index)
                state.taskList[index].title = payload.title
                state.taskList[index].subTaskList = payload.subTaskList
                state.taskList[index].performedList = payload.performedList
            }

            localStorage.setItem("taskList", JSON.stringify(state.taskList));
        },

        setLocalStorageList(state, payload) {
            console.log("modules/taskList/setLocalStorageList " + payload)
            state.taskList = JSON.parse(localStorage.getItem("taskList"))
            state.count = Number(localStorage.getItem("count"))
        },
        setTaskList(state, payload) {
            state.taskList = JSON.parse(JSON.stringify(payload))
        },

        setList(state, payload) {
            state.taskList = payload
        },
    },
    actions: {
        addNewTask(store, someText) {
            console.log("modules/taskList/addNewTask " + someText)
            store.commit('addNewTask', someText)
        },
        addNewSubTask(store, id) {
            console.log("modules/taskList/addNewSubTask/id " + id)
            store.commit('addNewTask', id)
        },
        delTask(store, id) {
            console.log("modules/taskList/delTask/id " + id)
            store.commit('delTask', id)
        },
        delSubTask(store, payload) {
            console.log("modules/taskList/delSubTask/ind+id " + payload.ind + "/" + payload.id)
            store.commit('delTask', payload)
        },
        updateTaskList(store, payload) {
            console.log("modules/taskList/updateTaskList/id " + payload.id)
            console.log("modules/taskList/updateTaskList/title " + payload.title)
            console.log("modules/taskList/updateTaskList/subTaskList " + payload.subTaskList)
            console.log("modules/taskList/updateTaskList/performedList " + payload.performedList)
            store.commit('updateTaskList', payload)
        },
        setLocalStorageList(store, payload) {
            console.log("modules/taskList/setLocalStorageList " + payload)
            store.commit('setLocalStorageList', payload)
        },
        setTaskList(store, payload) {
            console.log("modules/taskList/setTaskList " + payload)
            store.commit('setTaskList', payload)
        },
    },
};