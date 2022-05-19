const mysql = require('mysql2');

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

var con = mysql.createConnection(config.db);

con.connect(function (err) {
    if (err)
        console.log('error connecting:' + err.stack);
    console.log('Successfully connected to database! : "epytodo".');
});

module.exports = {
    config,
    con
}
