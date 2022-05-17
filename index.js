require("dotenv").config();

const express = require("express");
const mysql = require('mysql2');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const app = express();

// const urlencoded = require("body-parser/lib/types/urlencoded");
// const { response } = require("express");

const saltRounds = 10;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw())


const port = process.env.PORT || 3000;

var config = require('./src/config/db');
var con = config.con;


// var con = mysql.createConnection({
//     host: process.env.HOST,
//     user: "kevin",
//     password: process.env.PASSWORD,
//     database: "epytodo"
// });

// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected to database! : EPYTODO");
// });


function generateAccessToken(user) {
    return jwt.sign(user, process.env.SECRET, { expiresIn: '1800s' });
}


app.post("/register", (req, res) => {
    const { email, name, firstname, password } = req.body;

    if (email === "undefined" || name === "undefined" || firstname === "undefined" || password === "undefined") {
        res.status(401).json({
            "msg": "Bad parameter"
        })
    }

    let db_query = `SELECT password FROM user WHERE email = '${email}'`;

    con.query(db_query, function (err, result) {
        if (err) {
            if (result.length > 0) {
                res.status(401).json({
                    "msg": "Account already exists"
                })
            }
        }
        const hash = bcrypt.hashSync(password, saltRounds);
        // console.log(hash);

        let insert_query = `INSERT INTO user (email, password, name, firstname) VALUES ('${email}', '${hash}', '${name}', '${firstname}')`;

        con.query(insert_query, function (err, result) {
            if (err) {
                res.status(401).json({
                    "msg": "Bad parameter"
                })
            }
            else {
                res.status(200).json({
                    "msg": "Account created"
                })
            }
        });
    });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (email === "undefined" || password === "undefined") {
        res.status(401).json({
            "msg": "Bad parameter"
        })
    }

    let db_query = `SELECT * FROM user WHERE email = '${email}'`;

    con.query(db_query, function (err, result) {
        if (err) {
            if (result === "undefined" || !(result.length > 0)) {
                res.status(401).json({
                    "msg": "Bad parameter"
                })
            }
        }
        else {
            const db_user = result[0];
            bcrypt.compare(password, db_user.password, function (err, result) {
                // console.log(result);
                if (err) {
                    res.status(401).json({
                        "msg": "Invalid Credentials",
                    })
                }
                else {
                    res.status(200).json({
                        "token": generateAccessToken(db_user),
                    })
                }
            });

        }
    });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // console.log(token);

    if (!token) {
        res.status(401).json({
            "msg": "No token, authorization denied"
        })
    }

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            res.status(401).json({
                "msg": "Token is not valid"
            })
        }
        req.user = user;
        next();
    });
}

app.get("/user", authenticateToken, (req, res) => {
    const { id, email, password, created_at, firstname, name } = req.body;
    if (id === "undefined" || email === "undefined" || password === "undefined" || created_at === "undefined" || firstname === "undefined" || name === "undefined") {
        res.status(401).json({
            "msg": "Bad parameter"
        })
    }
    res.json({
        "id": req.user.id,
        "email": req.user.email,
        "password": req.user.password,
        "created_at": req.user.created_at,
        "firstname": req.user.firstname,
        "name": req.user.name
    })
});

app.get("/user/todos", authenticateToken, (req, res) => {
    let db_query = `SELECT * FROM todo WHERE user_id = '${req.user.id}'`;

    con.query(db_query, function (err, result) {
        if (err) {
            res.status(401).json({
                "msg": "Bad parameter"
            })
        }
        else {
            res.json(result);
        }
    });
});

app.get("/users/:id", authenticateToken, (req, res) => {
    let db_query = `SELECT * FROM user WHERE id = '${req.params.id}'`;

    con.query(db_query, function (err, result) {
        if (err) {
            res.status(401).json({
                "msg": "Bad parameter"
            })
        }
        else {
            res.status(200).json(result);
        }
    });
});

// app.put("/users/:id", authenticateToken, (req, res) => {


// });

app.delete("/users/:id", authenticateToken, (req, res) => {
    let db_query = `DELETE FROM user WHERE id = '${req.params.id}'`;

    con.query(db_query, function (err, result) {
        if (err) {
            res.status(401).json({
                "msg": "Bad parameter"
            })
        }
        else {
            res.status(200).json({
                "msg": "Successfully deleted record number : ${ id }",
            });
        }
    });
});

app.get("/todos", authenticateToken, (req, res) => {
    let db_query = `SELECT * FROM todo`;

    con.query(db_query, function (err, result) {
        if (err) {
            res.status(401).json({
                "msg": "Bad parameter"
            })
        }
        else {
            res.status(200).json(result);
        }
    });
});

app.get("/todos/:id", authenticateToken, (req, res) => {
    let db_query = `SELECT * FROM todo WHERE id = '${req.params.id}'`;

    con.query(db_query, function (err, result) {
        if (err) {
            res.status(401).json({
                "msg": "Bad parameter"
            })
        }
        else {
            res.status(200).json(result);
        }
    });
});

// app.put("/todos/:id", authenticateToken, (req, res) => {


// });

app.delete("/todos/:id", authenticateToken, (req, res) => {
    let db_query = `DELETE * FROM todo WHERE id = '${req.params.id}'`;

    con.query(db_query, function (err, result) {
        if (err) {
            res.status(401).json({
                "msg": "Bad parameter"
            })
        }
        else {
            res.status(200).json({
                "msg": "Successfully deleted record number : ${ id }",
            });
        }
    });
});


// con.end();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
