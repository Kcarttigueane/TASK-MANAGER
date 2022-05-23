require("dotenv").config();
const express = require("express");
const app = express();

var bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());

const port = process.env.PORT || 3000;

const auth_router = require('./routes/auth/authentification');
const user_router = require('./routes/user/user');
const todo_router = require('./routes/todos/todo');

app.use(auth_router);
app.use(user_router);
app.use(todo_router);

app.listen(port, () => {
    console.log(`\n\nExample app listening at http://localhost:${port}`);
});
