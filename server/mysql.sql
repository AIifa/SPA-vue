-- Сброс бд до начального уровня
-- drop schema taskList;

create database taskList;

use taskList;

create table tasks
( 
id integer primary key,
title varchar(255)
);

create table subTasks
( 
id integer primary key auto_increment,
subTask varchar(255),
performed boolean,
task_id integer,
foreign key (task_id) references tasks (id) ON UPDATE CASCADE ON DELETE CASCADE
);

insert into tasks
values
(1, 'Дела в выходные'),
(2, 'Список покупок'),
(3, 'Уборка');

insert into subTasks (subTask, performed, task_id)
values
('Отдых', false, 1),
('Котлеты', false, 2),
('Пюре', false, 2),
('Мытьё посуды', false, 3),
('Вынос мусора', false, 3),
('Стирка', false, 3);