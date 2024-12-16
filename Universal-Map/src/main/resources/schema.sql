CREATE TABLE IF NOT EXISTS users (
	id UUID,
	loginId varchar(256),
	userName varchar(256),
	password varchar(256)
);

CREATE TABLE IF NOT EXISTS options (
	id UUID,
	wheelchair varchar(5),
	stroller varchar(5),
	senior varchar(5),
	slope int,
	speed int,
	language varchar(32)
);
