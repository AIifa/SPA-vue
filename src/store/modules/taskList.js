// import { response } from "express";

export default {
    namespaced: true,
    state: {
        taskList: [],
        count: 0,
        url: "http://localhost:3000"
    },
    getters: {
        taskList(state) {
            return state.taskList;
        },
        count(state) {
            return state.count;
        },
        url(state) {
            return state.url;
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

            fetch(state.url + '/insertTask', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({ id: state.count, title: someText })
            })
                .then(response => response.json())
                .then(result => console.log("insert task"))
        },
        delTask(state, id) {
            let pos = state.taskList.map((el) => el.id).indexOf(id);
            console.log("modules/taskList/delTask/pos " + pos)
            if (pos !== -1) {
                console.log("modules/taskList/delTask/if " + pos)
                state.taskList.splice(pos, 1);
            }

            localStorage.setItem("taskList", JSON.stringify(state.taskList));

            fetch(state.url + '/deleteTask', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({ id: id })
            })
                .then(response => response.json())
                .then(result => console.log("delete task"))
        },
        updateTaskList(state, payload) {
            let index = state.taskList.map((el) => el.id).indexOf(payload.id);
            console.log("modules/taskList/updateTaskList/pos " + index)


            // 2 цикл проверки что добавлено/удалено
            let idSubTask = []
            let task = state.taskList[index]

            for (let i = 0; i < task.subTaskList.length; ++i) {
                let posSubTask = payload.subTaskList.indexOf(task.subTaskList[i])

                if (posSubTask == -1) {
                    idSubTask.push(i)
                }
            }

            if (index !== -1) {
                console.log("modules/taskList/updateTaskList/if " + index)
                state.taskList[index].title = payload.title
                state.taskList[index].subTaskList = payload.subTaskList
                state.taskList[index].performedList = payload.performedList
            }
            localStorage.setItem("taskList", JSON.stringify(state.taskList));
            console.log(idSubTask)
            fetch(state.url + '/updateTask', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({ task: state.taskList[index], id: idSubTask })
            })
                .then(response => response.json())
                .then(result => console.log("update task"))
        },

        setLocalStorageList(state, payload) {
            console.log("modules/taskList/setLocalStorageList " + payload)
            state.taskList = JSON.parse(localStorage.getItem("taskList"))
            state.count = Number(localStorage.getItem("count"))
        },
        fetchList(state, payload) {
            state.taskList = payload.dataList
            state.count = payload.count
            localStorage.setItem("taskList", JSON.stringify(state.taskList));
            localStorage.setItem("count", state.count);
        }
    },
    actions: {
        addNewTask(store, someText) {
            console.log("modules/taskList/addNewTask " + someText)
            store.commit('addNewTask', someText)
        },
        delTask(store, id) {
            console.log("modules/taskList/delTask/id " + id)
            store.commit('delTask', id)
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
        fetchList(store, payload) {
            console.log(payload)
            console.log("modules/taskList/fetchList " + payload)
            store.commit('fetchList', payload)
        }
    },
};