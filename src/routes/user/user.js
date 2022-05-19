var config = require('../../config/db');
var con = config.con;

const express = require("express");
const router = express.Router();

var bcrypt = require('bcryptjs');
const saltRounds = 10;

const {authenticateToken, ValidateEmail} = require("../../middleware/auth");

router.get("/user", authenticateToken, (req, res) => {
    res.json({
        "id": req.user.id,
        "email": req.user.email,
        "password": req.user.password,
        "created_at": req.user.created_at,
        "firstname": req.user.firstname,
        "name": req.user.name
    })
});

router.get("/user/todos", authenticateToken, (req, res) => {
    let db_query = `SELECT * FROM todo WHERE user_id = '${req.user.id}'`;

    con.query(db_query, function (err, result) {
        if (err) {
            res.status(400).json({
                "msg": "Bad parameter"
            })
        }
        else res.status(200).json(result);
    });
});

router.get('/users/:param', authenticateToken, (req, res) => {
    let db_query = `SELECT * FROM user WHERE id = '${req.params.param}' OR email = '${req.params.param}'`;

    con.query(db_query, function (err, result) {
        if (err) {
            res.status(400).json({
                "msg": "Bad parameter"
            })
        }
        else res.status(200).json(result);
    });
});

router.put("/users/:id", authenticateToken, (req, res) => {
    const { email, name , firstname, password} = req.body;

    if (email === undefined || name === undefined || firstname === undefined || password === undefined) {
        res.status(400).json({
            "msg": "Bad parameter"
        })
    }
    const hash = bcrypt.hashSync(password, saltRounds);
    console.log(hash);

    let db_query = `UPDATE user SET email = '${email}', name = '${name}', firstname = '${firstname}', password = '${hash}' WHERE id = '${req.params.id}'`;

    con.query(db_query, function (err, result) {
        if (err) {
            res.status(400).json({
                "msg": "Bad parameter"
            })
        }
        else res.status(200).json(result);
    });
});

router.delete('/users/:id', authenticateToken, (req, res) => {
    let db_query = `DELETE FROM user WHERE id = '${req.params.id}'`;

    con.query(db_query, function (err, result) {
        if (err) {
            res.status(400).json({
                "msg": "Bad parameter"
            })
        }
        else {
            res.status(200).json({
                "msg": "Successfully deleted record number: " + req.params.id,
            });
        }
    });
});

module.exports = router;
