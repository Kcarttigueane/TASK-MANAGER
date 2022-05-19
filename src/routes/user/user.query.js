// var config = require('../../config/db');
// var con = config.con;

// function delete_user(req, res) {
//     let db_query = `DELETE FROM user WHERE id = '${req.params.id}'`;

//     con.query(db_query, function (err, result) {
//         if (err) {
//             res.status(400).json({
//                 "msg": "Bad parameter"
//             })
//         }
//         else {
//             res.status(200).json({
//                 "msg": "Successfully deleted record number : ${ id }",
//             });
//         }
//     });
// }

// module.exports = {
//     dele,
// }
