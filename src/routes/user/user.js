const {all_user_task, all_user_information, update_user_information, delete_user} = require('./user.query');
const express = require("express");
const router = express.Router();

var bcrypt = require('bcryptjs');
const saltRounds = 10;

const {authenticateToken} = require("../../middleware/auth");

router.get("/user", authenticateToken, (req, res) => {
    res.json({
        "id": req.user.id,
        "email": req.user.email,
        "password": req.user.password,
        "created_at": req.user.created_at,
        "firstname": req.user.firstname,
        "name": req.user.name
    })
});


router.get("/user/todos", authenticateToken, (req, res) => {
    all_user_task(res, req.user.id);
});

router.get('/users/:param', authenticateToken, (req, res) => {
    all_user_information(res, req.params.param);
});

router.put("/users/:id", authenticateToken, (req, res) => {
    const { email, name, firstname, password} = req.body;

    if (email === undefined || name === undefined || firstname === undefined || password === undefined) {
        res.status(400).json({
            "msg": "Bad parameter"
        })
    }
    const hash = bcrypt.hashSync(password, saltRounds);
    update_user_information(res, req.params.id, email, name, firstname, hash);
});

router.delete('/users/:id', authenticateToken, (req, res) => {
    delete_user(res, req.params.id);
});

module.exports = router;
