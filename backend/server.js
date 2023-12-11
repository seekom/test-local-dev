const express = require("express");
const mysql = require("mysql2");
const {Pool} = require("pg");
var cors = require("cors");
const bodyParser = require("body-parser");

// Create the Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a connection to the MySQL database
const pgConfig = {
  host: process.env.DB_HOST || "db",
  port: process.env.DB_PORT || "5432",
  user: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "pass123",
  database: process.env.DB_NAME || "appdb",
};

let con = null;
const databaseInit = () => {
  // con = mysql.createConnection(mysqlConfig);
  con = new Pool(pgConfig);
  con.connect((err) => {
    if (err) {
      console.error("Error connecting to the database: ", err);
      return;
    }
    console.log("Connected to the database");
  });
};

const createDatabase = () => {
  con.query("CREATE DATABASE appdb", (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Database created successfully");
  });
};

const createTable = () => {
  con.query(
    "CREATE TABLE IF NOT EXISTS apptb (id SERIAL PRIMARY KEY, name VARCHAR(255))",
    (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Table created successfully");
    }
  );
};

// GET request
app.get("/user", (req, res) => {
  databaseInit();
  con.query("SELECT * FROM apptb", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.json(results.rows);
    }
  });
});

// POST request
app.post("/user", (req, res) => {
  con.query(
    "INSERT INTO apptb (name) VALUES ($1)",
    [req.body.data],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      } else {
        res.json(results.rows);
      }
    }
  );
});

app.post("/dbinit", (req, res) => {
  databaseInit();
  createDatabase();
  res.json("Database created successfully");
});

app.post("/tbinit", (req, res) => {
  databaseInit();
  createTable();
  res.json("Table created successfulliese");
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
