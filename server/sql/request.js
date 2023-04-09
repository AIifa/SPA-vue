module.exports.sqlGetList =
    `SELECT tasks.id, tasks.title, subtasks.subtask, subtasks.performed
    FROM tasks left join subtasks
    on subtasks.task_id = tasks.id
    order by subtasks.id;`;

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
    FROM subtasks
    where subtasks.task_id = ?;`;

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