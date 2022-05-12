
const express = require("express");
const app = express();

require("dotenv").config();
const port = process.env.PORT || 3000;

app.get("/name/:name", (req, res) => {
    if (req.is('html')) {
        res.send(`<h1>Hello ${req.params.name}</h1>`);
    } else if (req.is('json')) {
        res.json({
            name: req.params.name
        });
    }
    else {
        res.send(`Hello ${req.params.name}`);
    }
});

app.get("/date", (req, res) => {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    if (month < 10) {
        month = "0" + month;
    }
    var day = date.getDate();
    res.send(year + "-" + month + "-" + day);
});

app.listen(port, () => {
    console.log(` Example app listening at http ://localhost:${port}`) ;
});
