import gql from 'graphql-tag'
import { apolloClient } from '../../apolloClient';

export default {
    namespaced: true,
    state: {
        taskList: [],
        count: 0,
        url: "http://localhost:3000",
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

            const INSERT_TASK = gql`
                mutation insertTask($id: Int!, $title: String!){
                    insertTask(id: $id, title: $title){
                        str
                    }
                }
            `
            apolloClient.mutate({
                mutation: INSERT_TASK,
                variables: {
                    id: state.count,
                    title: someText
                }
            }).then(( data ) => {
                console.log(data)
            })

            localStorage.setItem("taskList", JSON.stringify(state.taskList));
            localStorage.setItem("count", state.count);
        },
        delTask(state, id) {
            let pos = state.taskList.map((el) => el.id).indexOf(id);
            console.log("modules/taskList/delTask/pos " + pos)
            if (pos !== -1) {
                console.log("modules/taskList/delTask/if " + pos)
                state.taskList.splice(pos, 1);
            }

            const DELETE_TASK = gql`
                mutation deleteTask($id: Int!){
                    deleteTask(id: $id){
                        str
                    }
                }
            `
            apolloClient.mutate({
                mutation: DELETE_TASK,
                variables: {
                    id: id
                }
            }).then(( data ) => {
                console.log(data)
            })

            localStorage.setItem("taskList", JSON.stringify(state.taskList));
        },
        updateTaskList(state, payload) {
            let index = state.taskList.map((el) => el.id).indexOf(payload.id);
            console.log("modules/taskList/updateTaskList/pos " + index)

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

            const UPDATE_TASK = gql`
                mutation updateTask($task: InputTask!, $id: [Int]){
                    updateTask(task: $task, id: $id){
                        str
                    }
                }
            `
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
            }).then(( data ) => {
                console.log(data)
            })

            localStorage.setItem("taskList", JSON.stringify(state.taskList));
            console.log(idSubTask)
        },

        setLocalStorageList(state, payload) {
            console.log("modules/taskList/setLocalStorageList " + payload)
            state.taskList = JSON.parse(localStorage.getItem("taskList"))
            state.count = Number(localStorage.getItem("count"))
        },
        fetchList(state, payload) {
            console.log(payload)

            state.taskList = payload.data.taskList
            state.count = payload.data.count
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
        fetchList(store) {
            const GET_LIST = gql`
                query {
                    data{
                        taskList{
                            id,
                            title,
                            subTaskList,
                            performedList
                        },
                    count
                    }
                }
            `
            apolloClient.query({
                query: GET_LIST
            }).then(({ data }) => {
                console.log(data)
                console.log("modules/taskList/fetchList ")
                store.commit('fetchList', data)
            })

        }
    },
};