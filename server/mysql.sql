--Сброс бд до начального уровня
--drop schema taskList;

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
(1, '1'),
(2, '2'),
(3, '3');

insert into subTasks (subTask, performed, task_id)
values
('1.1', false, 1),
('2.1', false, 2),
('2.2', false, 2),
('3.1', false, 3),
('3.2', false, 3),
('3.3', false, 3);