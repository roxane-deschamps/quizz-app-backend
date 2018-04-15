CREATE TABLE IF NOT EXISTS feedback(
 id integer PRIMARY KEY autoincrement,
   q1 integer,
 q2 integer,
 profil varchar(10),
 eval integer,
 commentaire varchar(200)
 
);


insert into feedback (q1, q2, profil, eval) values (1, 4, 2, 5);