


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
