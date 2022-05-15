require("dotenv").config();

const express = require("express");
const mysql = require('mysql2');
var bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 3000;

// create application/json parser
var jsonParser = bodyParser.json()

// app.use(express.bodyParser());

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var con = mysql.createConnection({
    host: process.env.HOST,
    user: "kevin",
    password: process.env.PASSWORD,
    database: "epytodo"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get("/api/:table", (req, res) => {
    let table_name = req.params.table;
    let sql = `SELECT * FROM ${table_name}`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

// insert a record inside a table using body parser
// app.post("/api/:table", urlencodedParser, (req, res) => {
//     let table_name = req.params.table;
//     let sql = `INSERT INTO ${table_name} SET ?`;
//     con.query(sql, req.body, function (err, result) {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// con.end();


app.listen(port, () => {
    console.log(` Example app listening at http ://localhost:${port}`);
});
