require("dotenv").config();

const express = require("express");
const mysql = require('mysql2');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const app = express();
const urlencoded = require("body-parser/lib/types/urlencoded");
const { response } = require("express");
// var salt = bcrypt.genSaltSync(10);
// var hash = bcrypt.hashSync("B4c0/\/", salt);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw())


const port = process.env.PORT || 3000;


var con = mysql.createConnection({
    host: process.env.HOST,
    user: "kevin",
    password: process.env.PASSWORD,
    database: "epytodo"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to database! : EPYTODO");
});

app.post("/register", (req, res) => {
    let email = req.body.email;
    let name = req.body.name;
    let first_name = req.body.firstname;
    let password = req.body.password;

    if (typeof email === "undefined" || typeof name === "undefined" || typeof first_name === "undefined" || typeof password === "undefined") {
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
        // ! FUNCTION USE TO HASH THE PASSWORD THEN STORE IT IN THE DB
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash("B4c0/\/", salt, function(err, hash) {
                let insert_query = `INSERT INTO user (email, password, name, firstname) VALUES ('${email}', '${hash}', '${name}', '${first_name}')`;
                console.log(insert_query);
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
    });
});

app.post("/login", (req, res) => {

});





// app.post("/register", (req, res) => {
//     let email = req.body.email;
//     let name = req.body.name;
//     let first_name = req.body.first_name;
//     let password = req.body.password;

//     let db_query = `SELECT password FROM user WHERE email = '${email}'`;
//     // let sql = `SELECT * FROM infos WHERE First_Name = 'Kevin'`;

//     con.query(db_query, function (err, result) {
//         if (err) throw err;
//         if (result.length > 0) {
//             res.json({
//                 "msg": "Account already exists"
//             })
//         }
//         else {
//         // let insert_query = `INSERT INTO infos (First_Name, Name, Age, Country, Computer_brand) VALUES ('David', 'DUPONT', 22, 'France', 'Dell')`;
            // let insert_query = `INSERT INTO user (email, name, first_name, password) VALUES ('${email}', '${name}', '${first_name}', '${password}')`;

//             // con.query(insert_query, function (err, result) {
//             //     if (err) {
//             //         res.json({
//             //             "msg": "Bad parameter"
//             //         })
//             //     }
// else {
//                     bcrypt.genSalt(10, function(err, salt) {
//                         bcrypt.hash("B4c0/\/", salt, function(err, hash) {
//                             console.log(hash);
//                             let hash_password = hash;
//                             // Store hash in your password DB.
//                         });
//                     });
//                     console.log(hash_password);
//                     res.json({
//                         " token ": "Token of the newly registered user"
//                     })
//                 }
//             });
//         }
//         // }
//     //     // else {
//     //     //     con.query(sql, function (err, result) {
//     //     //         if (err) throw err;
//     //     //         res.send("User created");
//     //     //     });
//     //     // }
//     // });
// });


// con.end();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
