-- drop table "task";
-- drop table "user";

create table "user" (
	id integer primary key,
	login text not null,
	email text,
	password_hash text not null
);

create unique index user_login_unique on "user"(login);

create table "task" (
	id integer primary key,
	fk_user integer not null,
	name text not null,
	created_at integer not null default (strftime('%s', 'now')),
	description text,
	archived integer not null default 0,
	
	constraint fk_user__user_id foreign key (fk_user) references "user"(id) on delete cascade
);
