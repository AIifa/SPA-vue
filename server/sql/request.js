module.exports.sqlGetList =
    `SELECT tasks.id, tasks.title, subTasks.subtask, subTasks.performed
    FROM tasks left join subTasks
    on subTasks.task_id = tasks.id
    order by subTasks.id;`;

module.exports.sqlUpdTask =
    `UPDATE tasks
    SET title = ?
    WHERE tasks.id = ?`;

module.exports.sqlUpdSubTasks =
    `UPDATE subTasks
    SET subTask = ?, performed = ?
    WHERE id = ?`;

module.exports.sqlGetIdSubTasks =
    `SELECT id
    FROM subTasks
    where subTasks.task_id = ?;`;

module.exports.sqlDelTask =
    `DELETE FROM tasks
    WHERE id = ?;`

module.exports.sqlDelSubTask =
    `DELETE FROM subTasks
    WHERE id = ?;`

module.exports.sqlInsTask =
    `INSERT INTO tasks
    values 
    (?, ?);`

module.exports.sqlInsSubTask =
    `INSERT INTO subTasks (subTask, performed, task_id)
    values 
    (?, ?, ?);`