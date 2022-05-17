// require("dotenv").config();
const mysql = require('mysql2');

// config.js
const config = {
    app: {
        port: 3000
    },
    db: {
        host: process.env.HOST,
        user: "kevin",
        password: process.env.PASSWORD,
        database: "epytodo"
    }
};

// ? DEMANDER COMMENT ENVOYER config.db AU LIEU DE REPETER HOST, USER, PASSWORD, DATABASE
var con = mysql.createConnection({
    host: process.env.HOST,
    user: "kevin",
    password: process.env.PASSWORD,
    database: "epytodo"
});

con.connect(function (err) {
    if (err) {
        console.log('error connecting:' + err.stack);
    }
    console.log('Successfully connected to database! : "epytodo".');
});

module.exports = {
    config,
    con
}
