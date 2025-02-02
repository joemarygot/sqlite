import sqlite3 from "sqlite3";
const sql3 = sqlite3.verbose();

//sql3.Database(NAME_OF_DATABASE, WHY_YOU_CONNECT, CALLBACK)
// const DB = new sql3.Database(':memory:', sqlite3.OPEN_READWRITE, connected);
// const DB = new sql3.Database('', sqlite3.OPEN_READWRITE, connected);
const DB = new sql3.Database("./mydata.db", sqlite3.OPEN_READWRITE, connected);

function connected(err) {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log("Connected o the DB or SQLite DB does already exist");
}

let sql = `CREATE TABLE IF NOT EXISTS enemies(
    enemy_id INTEGER PRIMARY KEY,
    enemy_name TEXT NOT NULL,
    enemy_reason TEXT NOT NULL
)`;
DB.run(sql, [], (err) => {
  //Callback function
  if (err) {
    console.log("error creating enemies table");
    return;
  }
  console.log("CREATED TABLE");
});

export { DB };
