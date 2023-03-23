const express = require('express');
// const cors = require('cors');
const mysql = require('mysql2');

const { ApolloServer, gql } = require('apollo-server-express')

const port = 3000

// поле для интеграции БД
const connection = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    // password: '12zxwsaqWQ#', // первая машина
    password: '12345678', // вторая машина
    database: 'taskList'
})

const app = express();
// app.use(cors());

const sqlGetList =
    `SELECT tasks.id, tasks.title, subtasks.subtask, subtasks.performed
    FROM tasks left join subtasks
    on subtasks.task_id = tasks.id
    order by subtasks.id;`;

const sqlUpdTask =
    `UPDATE tasks
    SET title = ?
    WHERE tasks.id = ?`;

const sqlUpdSubTasks =
    `UPDATE subTasks
    SET subTask = ?, performed = ?
    WHERE id = ?`;

const sqlGetIdSubTasks =
    `SELECT id
    FROM subtasks
    where subtasks.task_id = ?;`;

const sqlDelTask =
    `DELETE FROM tasks
    WHERE id = ?;`

const sqlDelSubTask =
    `DELETE FROM subTasks
    WHERE id = ?;`

const sqlInsTask =
    `INSERT INTO tasks
    values 
    (?, ?);`

const sqlInsSubTask =
    `INSERT INTO subTasks (subTask, performed, task_id)
    values 
    (?, ?, ?);`


const typeDefs = `
    type Task {
      id: Int!
      title: String
      subTaskList: [String]
      performedList: [Boolean]
    }
  
    type Data {
        taskList: [Task!]!
        count: Int!
    }

    type Query {
      data: Data
      example: [Task]
      getList: Data
    }

    input InputTask {
        id: Int!
        title: String!
        subTaskList: [String]
        performedList: [Boolean]
    }

    type Res{
        str: String
    }

    type Mutation {
        updateTask(task: InputTask, id: [Int]): Res
        insertTask(id: Int!, title: String!): Res
        deleteTask(id: Int!): Res
    }
  `

function getList() {
    return new Promise(function (resolve, reject) {
        connection.query(sqlGetList, (err, results) => {
            if (err) throw err
            console.log(results)

            const taskList = results
            let dataTask = []
            for (let i = 0; i < taskList.length;) {
                let id = taskList[i].id
                let obj = { id: id, title: taskList[i].title, subTaskList: [], performedList: [] }

                let subList = []
                let performedList = []

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
            console.log(dataTask)
            dataTask.sort((a, b) => a.id - b.id);
            resolve({ taskList: dataTask, count: dataTask[dataTask.length - 1].id })
        });
    })
}

function insertTask(task){
    return new Promise(function (resolve, reject) {
        connection.query(sqlInsTask, [task.id, task.title], (err, data) => {
            if (err) throw err

            resolve({str: "success"})
        })
    })
}

function deleteTask(data){
    return new Promise(function (resolve, reject) {
        console.log(data)
        connection.query(sqlGetIdSubTasks, [data.id], (err, results) => {
            if (err) throw err
            console.log(results)

            for (let i = 0; i < results.length; i++) {
                connection.query(sqlDelSubTask, [results[i].id], (err, data) => {
                    if (err) throw err
                })
            }
        })
        connection.query(sqlDelTask, [data.id], (err, data) => {
            if (err) throw err
        })

        resolve({str: "success"})
    })
}

function updateTask(data){
    return new Promise(function (resolve, reject) {
        let id = data.task.id;
        let title = data.task.title;
        console.log(data)
        connection.query(sqlUpdTask, [title, id], (err, data) => {
            if (err) throw err
        })

        connection.query(sqlGetIdSubTasks, [id], (err, results) => {
            if (err) throw err
            console.log(results)

            // Удаление из БД
            if (data.id.length) {
                console.log("удаление из БД")
                for (let i = 0; i < data.id.length; i++) {
                    connection.query(sqlDelSubTask, [results[data.id[i]].id], (err, data) => {
                        if (err) throw err
                    })
                    results.splice(data.id[i], 1);
                }
            }

            // Обновление БД
            console.log(results)
            for (let i = 0; i < results.length; i++) {
                let subTask = data.task.subTaskList[i]
                let performed = data.task.performedList[i]
                connection.query(sqlUpdSubTasks, [subTask, performed, results[i].id], (err, data) => {
                    if (err) throw err
                })
            }

            // Добавление в БД
            for (let i = results.length; i < data.task.subTaskList.length; i++) {
                let subTask = data.task.subTaskList[i]
                let performed = data.task.performedList[i]
                connection.query(sqlInsSubTask, [subTask, performed, id], (err, data) => {
                    if (err) throw err
                })
            }

        })

        resolve({str: "success"})
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