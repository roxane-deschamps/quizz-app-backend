CREATE TABLE IF NOT EXISTS feedback(
 id integer PRIMARY KEY autoincrement,
 time_reception timestamp,
 profil varchar(10),
 eval integer,
 commentaire varchar(200),
 email varchar(100),
 savoir_plus boolean
);

CREATE TABLE IF NOT EXISTS reponse_question(
feedback_id integer  not null,
num_question integer,
reponse integer,
FOREIGN KEY(feedback_id) REFERENCES feedback(id)
);
