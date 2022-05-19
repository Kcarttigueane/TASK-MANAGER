var config = require('../../config/db');
var con = config.con;

exports.all_user_task = function (res, id) {
    con.query(`SELECT * FROM todo WHERE user_id = '${id}'`, function (err, results, fields) {
        if (err) {
            res.status(400).json({
                "msg": "Bad parameter"
            })
        }
        else res.status(200).json(results);
    });
}

exports.all_user_information = function (res, param) {
    let db_query = `SELECT * FROM user WHERE id = '${param}' OR email = '${param}'`;

    con.query(db_query, function (err, result) {
        if (err) {
            res.status(400).json({
                "msg": "Bad parameter"
            })
        }
        else res.status(200).json(result);
    });
}

exports.update_user_information= function(res, id, email, name, firstname, hash) {
    let db_query = `UPDATE user SET email = '${email}', name = '${name}', firstname = '${firstname}', password = '${hash}' WHERE id = '${id}'`;
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

exports.delete_user = function(res, id) {
    let db_query = `DELETE FROM user WHERE id = '${id}'`;
    console.log(db_query);

    con.query(db_query, function (err, result) {
        if (err) {
            res.status(400).json({
                "msg": "Bad parameter"
            })
        }
        else {
            res.status(200).json({
                "msg": "Successfully deleted record number: " + id,
            });
        }
    });
}
