const express = require("express");
const router = express.Router();

const {authenticateToken} = require("../../middleware/auth");

const {view_all_the_todos, view_the_todo_using_id, create_a_todo, update_a_todo, delete_a_todo_using_id} = require('./todos.query');

router.get("/todos", authenticateToken, (req, res) => {
    view_all_the_todos(res);
});

router.get("/todos/:id", authenticateToken, (req, res) => {
    view_the_todo_using_id(res, req.params.id);
});

router.post("/todos", authenticateToken, (req, res) => {
    const { title, description, due_time, user_id, status } = req.body;

    if (title === undefined || description === undefined || due_time === undefined, user_id === undefined) {
        res.status(400).json({
            "msg": "Bad parameter"
        })
    }
    create_a_todo(title, description, due_time, user_id, status, res);
});


router.put("/todos/:id", authenticateToken, (req, res) => {
    const { title, description, due_time, user_id, status } = req.body;

    if (title === undefined || description === undefined || due_time === undefined, user_id === undefined) {
        res.status(400).json({
            "msg": "Bad parameter"
        })
    }
    update_a_todo(title, description, due_time, user_id, status, res);
});

router.delete('/todos/:id', authenticateToken, (req, res) => {
    delete_a_todo_using_id(res, req.params.id);
});

module.exports = router;
