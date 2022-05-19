var config = require('../../config/db');
var con = config.con;

var bcrypt = require('bcryptjs');
const saltRounds = 10;

const express = require("express");
const router = express.Router();

const { generateAccessToken } = require("../../middleware/auth");

router.post("/register", (req, res) => {
    const { email, name, firstname, password } = req.body;

    if (email === "undefined" || name === "undefined" || firstname === "undefined" || password === "undefined") {
        res.status(400).json({
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

        let insert_query = `INSERT INTO user (email, password, name, firstname) VALUES ('${email}', '${hash}', '${name}', '${firstname}')`;

        con.query(insert_query, function (err, result) {
            if (err) {
                res.status(400).json({
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

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (email === "undefined" || password === "undefined") {
        res.status(400).json({
            "msg": "Bad parameter"
        })
    }

    let db_query = `SELECT * FROM user WHERE email = '${email}'`;
    console.log(db_query);

    con.query(db_query, function (err, result) {
        if (!(result.length > 0)) {
            res.status(404).json({
                "msg": "Not found",
            })
        }
        if (err) {
            if (result === "undefined" || !(result.length > 0)) {
                res.status(400).json({
                    "msg": "Bad parameter"
                })
            }
        }
        else {
            const db_user = result[0];
            bcrypt.compare(password, db_user.password, function (err, result) {
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

module.exports = router;
