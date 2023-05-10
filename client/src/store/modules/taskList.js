import { apolloClient } from "../../apolloClient"
import { DELETE_TASK } from "../../graphql/deleteTask.gql"
import { GET_LIST } from "../../graphql/getList.gql"
import { INSERT_TASK } from "../../graphql/insertTask.gql"
import { UPDATE_TASK } from "../../graphql/updateTask.gql"

export default {
    namespaced: true,
    state: {
        taskList: [],
        count: 0,
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

            apolloClient.mutate({
                mutation: INSERT_TASK,
                variables: {
                    id: state.count,
                    title: someText
                }
            }).then((res) => {
                if (res.data.insertTask.res == "success") {
                    localStorage.setItem("taskList", JSON.stringify(state.taskList));
                    localStorage.setItem("count", state.count);
                }
            })
        },
        delTask(state, id) {
            let pos = state.taskList.map((el) => el.id).indexOf(id);
            if (pos !== -1) {
                state.taskList.splice(pos, 1);
            }

            apolloClient.mutate({
                mutation: DELETE_TASK,
                variables: {
                    id: id
                }
            })

            localStorage.setItem("taskList", JSON.stringify(state.taskList));
        },
        updateTaskList(state, payload) {
            let index = state.taskList.map((el) => el.id).indexOf(payload.id);

            const idSubTask = []
            let task = state.taskList[index]

            for (let i = 0; i < task.subTaskList.length; ++i) {
                let posSubTask = payload.subTaskList.indexOf(task.subTaskList[i])

                if (posSubTask == -1) {
                    idSubTask.push(i)
                }
            }

            if (index !== -1) {
                state.taskList[index].title = payload.title
                state.taskList[index].subTaskList = payload.subTaskList
                state.taskList[index].performedList = payload.performedList
            }

            apolloClient.mutate({
                mutation: UPDATE_TASK,
                variables: {
                    task: {
                        id: payload.id,
                        title: payload.title,
                        subTaskList: payload.subTaskList,
                        performedList: payload.performedList
                    },
                    id: idSubTask
                }
            })

            localStorage.setItem("taskList", JSON.stringify(state.taskList));
        },

        setLocalStorageList(state, payload) {
            state.taskList = JSON.parse(localStorage.getItem("taskList"))
            state.count = Number(localStorage.getItem("count"))
        },
        fetchList(state, payload) {
            state.taskList = payload.data.taskList
            state.count = payload.data.count
            localStorage.setItem("taskList", JSON.stringify(state.taskList));
            localStorage.setItem("count", state.count);
        }
    },
    actions: {
        addNewTask(store, someText) {
            store.commit("addNewTask", someText)
        },
        delTask(store, id) {
            store.commit("delTask", id)
        },
        updateTaskList(store, payload) {
            store.commit("updateTaskList", payload)
        },
        setLocalStorageList(store, payload) {
            store.commit("setLocalStorageList", payload)
        },
        fetchList(store) {
            return new Promise((resolve, reject) => {
                apolloClient.query({
                query: GET_LIST
            }).then(({ data }) => {
                store.commit("fetchList", data)
                resolve(data.data.taskList.length)
            })
            })
            
        }
    },
};