var config = require('../../config/db');
var con = config.con;

exports.view_all_the_todos = function(res) {
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

exports.view_the_todo_using_id = function(res, id) {
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











exports.delete_a_todo_using_id = function(res, id) {
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
