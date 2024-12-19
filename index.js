import { DB } from "./connect.js";

import express from "express";
import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200);
  res.send("Mortal enemy service is online");
});

//Create Endpoint
app.get("/api", (req, res) => {
  //Request data from the table
  res.set("content-type", "application/json");
  const sql = "SELECT * FROM enemies";
  let data = { enemies: [] };
  try {
    // DB.get() returns single row
    //DB.all() retusn all data
    DB.all(sql, [], (err, rows) => {
      if (err) {
        throw err; //Let catch handle it
      }
      rows.forEach((row) => {
        data.enemies.push({
          id: row.enemy_id,
          name: row.enemy_name,
          reason: row.enemy_reason,
        });
      });
      let content = JSON.stringify(data);
      res.send(content);
    });
  } catch (err) {
    console.log(err.message);
    res.status(467);
    res.send(`{"code":467, "status": "${err.message}"}`);
  }
});
app.post("/api", (req, res) => {
  //Adding data to the table
  console.log(req.body);
  res.set("content-type", "application/json");
  const sql = "INSERT INTO enemies(enemy_name, enemy_reason) VALUES (? , ?)";
  let newId;
  try {
    DB.run(sql, [req.body.name, req.body.reason], function (err) {
      if (err) throw err;
      newId = this.lastID; //Provides the auto increment integer enemy_id
      res.status(201);
      let data = { status: 201, message: `Mortal enemy ${newId} saved.` };
      let content = JSON.stringify(data);
      res.send(content);
    });
  } catch (err) {
    console.log(err.message);
    res.status(468);
    res.send(`{"code":468, "status": "${err.message}"}`);
  }
});
app.delete("/api", (req, res) => {
  //Deleting data from the table
  res.set("content-type", "application/json");
  const sql = "DELETE FROM enemies WHERE enemy_id=?";
  try {
    DB.run(sql, [req.query.id], function (err) {
      if (err) throw err;
      if (this.changes === 1) {
        //One item deleted
        res.status(200);
        res.send(`{"message": "Enemy ${req.query.id} was removed fron list."}`);
      } else {
        //No delete done
        res.status(200);
        res.send(`{"message": "No operation needed."}`);
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(468);
    res.send(`{"code":468, "status": "${err.message}"}`);
  }
});

app.listen(3000, (err) => {
  if (err) {
    console.log("ERROR:", err.message);
    return;
  }
  console.log("LISTENING on port 3000");
});
