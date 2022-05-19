var config = require('../../config/db');
var con = config.con;

const express = require("express");
const router = express.Router();

const {authenticateToken} = require("../../middleware/auth");

router.get("/todos", authenticateToken, (req, res) => {
    let db_query = `SELECT * FROM todo`;

    con.query(db_query, function (err, result) {
        if (err) {
            res.status(400).json({
                "msg": "Bad parameter"
            })
        }
        else res.status(200).json(result);
    });
});

router.get("/todos/:id", authenticateToken, (req, res) => {
    let db_query = `SELECT * FROM todo WHERE id = '${req.params.id}'`;
    console.log(db_query);

    con.query(db_query, function (err, result) {
        if (err) {
            res.status(400).json({
                "msg": "Bad parameter"
            })
        }
        else res.status(200).json(result);
    });
});

router.post("/todos", authenticateToken, (req, res) => {
    const { title, description, due_time, user_id, status } = req.body;
    console.log(status);

    if (title === 'undefined' || description === 'undefined' || due_time === 'undefined', user_id === 'undefined') {
        res.status(400).json({
            "msg": "Bad parameter"
        })
    }
    let db_query;

    // ! DEMANDER A L'AER POURQUOI CA MARCHE PAS AU NIVEAU DU DEFAULT
    if (status === 'undefined')
        db_query = `INSERT INTO todo (title, description, due_time, user_id, status) VALUES ('${title}', '${description}', '${due_time}', '${user_id}', DEFAULT)`;
    else
        db_query = `INSERT INTO todo (title, description, due_time, user_id, status) VALUES ('${title}', '${description}', '${due_time}', '${user_id}', 'not started')`;


    con.query(db_query, function (err, result) {
        if (err) {
            res.status(400).json({
                "msg": "Bad parameter",
            })
        }
        else res.status(200).json(req.body);
    });
});

router.put("/todos/:id", authenticateToken, (req, res) => {
    const { title, description, due_time, user_id, status } = req.body;

    if (title === 'undefined' || description === 'undefined' || due_time === 'undefined', user_id === 'undefined') {
        res.status(400).json({
            "msg": "Bad parameter"
        })
    }
    let db_query;

    console.log('==+>' + status);

    if (status === 'undefined') {
        db_query = `UPDATE todo SET title = '${title}', description = '${description}', due_time = '${due_time}', user_id = '${user_id}', status = 'not started' WHERE id = '${req.params.id}'`;
    }
    else {
        db_query = `UPDATE todo SET title = '${title}', description = '${description}', due_time = '${due_time}', user_id = '${user_id}', status = 'not started' WHERE id = '${req.params.id}'`;
    }

    con.query(db_query, function (err, result) {
        if (err) {
            console.error(err);
            res.status(400).json({
                "msg": "Bad parameter"
            })
        }
        else res.status(200).json(result);
    });
});

router.delete('/todos/:id', authenticateToken, (req, res) => {
    let db_query = `DELETE FROM todo WHERE id = '${req.params.id}'`;

    con.query(db_query, function (err, result) {
        if (err) {
            console.error(err);
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
