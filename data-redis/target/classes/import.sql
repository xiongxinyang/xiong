create table `city` (
  `id` int(11) primary key auto_increment,
  `name` varchar(32) DEFAULT NULL,
  `state` varchar(11) DEFAULT NULL,
  `country` varchar(11) DEFAULT NULL
);

insert into city (name, state, country) values ('San Francisco', 'CA', 'US');