const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mysql = require('mysql2');

const app = express();
const urlencodedParser = express.urlencoded({ extended: false });

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());


const port = 3000

// поле для интеграции БД
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12zxwsaqWQ#', // первая машина
    // password: '12345678', // вторая машина
    database: 'taskList'
})


const sqlGetList =
    `SELECT tasks.id, tasks.title, subtasks.subtask, subtasks.performed
    FROM tasks left join subtasks
    on subtasks.task_id = tasks.id;`;

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


app.get('/', (req, res) => {
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
        res.json({ dataList: dataTask, count: dataTask[dataTask.length - 1].id });
    });
});

app.post("/updateTask", urlencodedParser, (req, res) => {
    let id = req.body.task.id;
    let title = req.body.task.title;
    console.log(req.body)
    connection.query(sqlUpdTask, [title, id], (err, data) => {
        if (err) throw err
    })

    connection.query(sqlGetIdSubTasks, [id], (err, results) => {
        if (err) throw err
        console.log(results)

        // Удаление из БД
        if (req.body.id.length) {
            console.log("удаление из БД")
            for (let i = 0; i < req.body.id.length; i++) {
                connection.query(sqlDelSubTask, [results[req.body.id[i]].id], (err, data) => {
                    if (err) throw err
                })
                results.splice(req.body.id[i], 1);
            }
        }

        // Обновление БД
        console.log(results)
        for (let i = 0; i < results.length; i++) {
            let subTask = req.body.task.subTaskList[i]
            let performed = req.body.task.performedList[i]
            connection.query(sqlUpdSubTasks, [subTask, performed, results[i].id], (err, data) => {
                if (err) throw err
            })
        }

        // Добавление в БД
        for (let i = results.length; i < req.body.task.subTaskList.length; i++) {
            let subTask = req.body.task.subTaskList[i]
            let performed = req.body.task.performedList[i]
            connection.query(sqlInsSubTask, [subTask, performed, id], (err, data) => {
                if (err) throw err
            })
        }

    })
})

app.post("/deleteTask", urlencodedParser, (req, res) => {
    // Удалить задание и подзадачи
    let id = req.body.id;
    connection.query(sqlGetIdSubTasks, [id], (err, results) => {
        if (err) throw err
        console.log(results)

        for (let i = 0; i < results.length; i++) {
            connection.query(sqlDelSubTask, [results[i].id], (err, data) => {
                if (err) throw err
            })
        }
    })
    connection.query(sqlDelTask, [id], (err, data) => {
        if (err) throw err
    })
})

app.post("/deleteSubTask", urlencodedParser, (req, res) => {
    let subTask = req.body.subTask;
    console.log(req.body)
    connection.query(sqlDelSubTask, [subTask], (err, data) => {
        if (err) throw err
    })
})


app.post("/insertTask", urlencodedParser, (req, res) => {
    connection.query(sqlInsTask, [req.body.id, req.body.title], (err, data) => {
        if (err) throw err
    })
})


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});