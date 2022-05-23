var config = require('../../config/db');
var con = config.con;

exports.view_all_the_todos = function (res) {
    let db_query = `SELECT * FROM todo`;

    con.query(db_query, function (err, result) {
        if (err) {
            res.status(400).json({
                "msg": "Bad parameter"
            })
        }
        else res.status(200).json(result);
    });
}

exports.view_the_todo_using_id = function (res, id) {
    let db_query = `SELECT * FROM todo WHERE id = '${id}'`;
    console.log(db_query);

    con.query(db_query, function (err, result) {
        if (err) {
            res.status(400).json({
                "msg": "Bad parameter"
            })
        }
        else res.status(200).json(result);
    });
}

exports.create_a_todo = function (title, description, due_time, user_id, status, res, req) {
    if (status === undefined) {
        db_query = `INSERT INTO todo (title, description, due_time, user_id, status) VALUES ('${title}', '${description}', '${due_time}', '${user_id}', 'not started')`;
    }
    else {
        db_query = `INSERT INTO todo (title, description, due_time, user_id, status) VALUES ('${title}', '${description}', '${due_time}', '${user_id}', '${status}')`;
    }

    con.query(db_query, function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).json({
                "msg": "Bad parameter",
            })
        }
        else res.status(200).json(req.body);
    });
}

exports.update_a_todo = function(title, description, due_time, user_id, status, req, res) {
    let db_query;

    if (status === undefined) {
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
        else res.status(200).json(req.body);
    });
}

exports.delete_a_todo_using_id = function (res, req, id) {
    let db_query = `DELETE FROM todo WHERE id = '${id}'`;

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
}
