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
        res.json({
            "msg": "Bad parameter"
        })
    }

    let db_query = `SELECT password FROM user WHERE email = '${email}'`;

    con.query(db_query, function (err, result) {
        if (err) {
            if (result.length > 0) {
                res.json({
                    "msg": "Account already exists"
                })
            }
        }
        const hash = bcrypt.hashSync(password, saltRounds);
        console.log(hash);

        let insert_query = `INSERT INTO user (email, password, name, firstname) VALUES ('${email}', '${hash}', '${name}', '${firstname}')`;

        con.query(insert_query, function (err, result) {
            if (err) {
                res.json({
                    "msg": "Bad parameter"
                })
            }
            else {
                res.json({
                    "msg": "Account created"
                })
            }
        });
    });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (email === "undefined" || password === "undefined") {
        res.json({
            "msg": "Bad parameter"
        })
    }

    let db_query = `SELECT * FROM user WHERE email = '${email}'`;

    con.query(db_query, function (err, result) {
        if (err) {
            if (result === "undefined" || !(result.length > 0)) {
                res.json({
                    "msg": "Bad parameter"
                })
            }
        }
        else {
            const db_user = result[0];
            bcrypt.compare(password, db_user.password, function (err, result) {
                console.log(result);
                if (err) {
                    res.json({
                        "msg": "Invalid Credentials",
                    })
                }
                else {
                    res.json({
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
    console.log(token);

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(401);
        }
        req.user = user;
        next();
    });
}


app.get("/user", authenticateToken, (req, res) => {
    // res.json ({
    //     "msg": "User authenticated",
    // })
    res.send(req.user);
});



// con.end();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
