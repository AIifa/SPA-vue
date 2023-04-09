const express = require("express");
const mysql = require("mysql2");
const { ApolloServer, gql } = require("apollo-server-express")
const { typeDefs } = require("./graphql/typeDefs")
const { sqlGetList, sqlUpdTask, sqlUpdSubTasks, sqlGetIdSubTasks,
    sqlDelTask, sqlDelSubTask, sqlInsTask, sqlInsSubTask } = require("./sql/request")

require('dotenv').config();

const port = process.env.PORT

// поле для интеграции БД
const connection = mysql.createPool({
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

const app = express();

function getList() {
    return new Promise(function (resolve, reject) {
        connection.query(sqlGetList, (err, taskList) => {
            if (err) throw reject(err)
            // console.log(results)

            // const taskList = results
            const dataTask = []
            for (let i = 0; i < taskList.length;) {
                let id = taskList[i].id
                let obj = { id: id, title: taskList[i].title, subTaskList: [], performedList: [] }

                const subList = []
                const performedList = []

                if (taskList[i].subtask == null) {
                    i++
                }
                else {
                    subList.push(taskList[i].subtask)
                    performedList.push(Boolean(taskList[i].performed))

                    for (let j = i + 1; j < taskList.length; j++) {
                        if (id == taskList[j].id) {
                            subList.push(taskList[j].subtask)
                            performedList.push(Boolean(taskList[j].performed))
                        }
                    }
                }

                obj.subTaskList = subList
                obj.performedList = performedList
                dataTask.push(obj)
                i += obj.subTaskList.length
            }
            // console.log(dataTask)
            dataTask.sort((a, b) => a.id - b.id);
            resolve({ taskList: dataTask, count: dataTask[dataTask.length - 1].id })
        });
    })
}

function insertTask(task) {
    return new Promise(function (resolve, reject) {
        connection.query(sqlInsTask, [task.id, task.title], (err) => {
            if (err) throw reject(err)

            resolve({ res: "success" })
        })
    })
}

function deleteTask(data) {
    return new Promise(function (resolve, reject) {
        // console.log(data)
        connection.query(sqlDelTask, [data.id], (err) => {
            if (err) throw reject(err)
        })

        resolve({ res: "success" })
    })
}

function updateTask(data) {
    return new Promise(function (resolve, reject) {
        let id = data.task.id;
        let title = data.task.title;
        // console.log(data)
        connection.query(sqlUpdTask, [title, id], (err, data) => {
            if (err) throw reject(err)
        })

        connection.query(sqlGetIdSubTasks, [id], (err, results) => {
            if (err) throw reject(err)
            // console.log(results)

            // Удаление подзадач, которые были удалены на стороне клиента из БД
            if (data.id.length) {
                // console.log("удаление из БД")
                for (let i = 0; i < data.id.length; i++) {
                    connection.query(sqlDelSubTask, [results[data.id[i]].id], (err, data) => {
                        if (err) throw reject(err)
                    })
                    results.splice(data.id[i], 1);
                }
            }

            // Обновление БД
            // console.log(results)
            for (let i = 0; i < results.length; i++) {
                let subTask = data.task.subTaskList[i]
                let performed = data.task.performedList[i]
                connection.query(sqlUpdSubTasks, [subTask, performed, results[i].id], (err, data) => {
                    if (err) throw reject(err)
                })
            }

            // Добавление в БД
            for (let i = results.length; i < data.task.subTaskList.length; i++) {
                let subTask = data.task.subTaskList[i]
                let performed = data.task.performedList[i]
                connection.query(sqlInsSubTask, [subTask, performed, id], (err, data) => {
                    if (err) throw reject(err)
                })
            }

        })

        resolve({ res: "success" })
    })
}

const resolvers = {
    Query: {
        data: () => getList(),
    },
    Mutation: {
        updateTask: (_, data) => updateTask(data),
        insertTask: (_, task) => insertTask(task),
        deleteTask: (_, data) => deleteTask(data)
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.start()
server.applyMiddleware({ app });


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});