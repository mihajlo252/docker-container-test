const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path")
const methodOverride = require("method-override");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MySQL
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : "localhost",
    user            : "root",
    database        : "nodejs-mysql-test",
});

// Show all characters
app.get("/", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as id ${connection.threadId}`);

        let allRows = []

        connection.query("SELECT * from characters", (err, rows) => {
            connection.release(); // return the connection pool
        
            if (!err) {
                allRows = rows;
                res.render("index", { allRows })

            } else {
                console.log(err);
            }
        });
    });
});

// Show details of a character by ID
app.get("/:id", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as id ${connection.threadId}`);


        connection.query("SELECT * from characters WHERE id = ?", [ req.params.id ], (err, rows) => {
            connection.release(); // return the connection pool

            if (!err) {
                res.render('show', { rows });
            } else {
                console.log(err);
            }
        });
    });
});

// Show create a character
app.get("/create/new", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as id ${connection.threadId}`);


        connection.query("SELECT * from characters WHERE id = ?", [ req.params.id ], (err, rows) => {
            connection.release(); // return the connection pool

            if (!err) {
                res.render('new');
            } else {
                console.log(err);
            }
        });
    });
});

// Show edit for a character by ID
app.get("/:id/edit", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as id ${connection.threadId}`);


        connection.query("SELECT * from characters WHERE id = ?", [ req.params.id ], (err, rows) => {
            connection.release(); // return the connection pool

            if (!err) {
                console.log(rows[0].name)
                res.render('edit', { rows });
            } else {
                console.log(err);
            }
        });
    });
});

// Add a character
app.post("/", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as id ${connection.threadId}`);

        const params = req.body;

        connection.query("INSERT INTO characters SET ?", params, (err, rows) => {
            connection.release(); // return the connection pool

            if (!err) {
                res.redirect('/');
            } else {
                console.log(err);
            }
        });
    });
});

// Update a character
app.put("/:id", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as id ${connection.threadId}`);

        const { id, name, race, gender, proffession } = req.body;

        connection.query("UPDATE characters SET name = ?, race = ?, gender = ?, proffession = ? WHERE id = ?", [name, race, gender, proffession, id], (err, rows) => {
            connection.release(); // return the connection pool

            console.log(req.body)

            if (!err) {
                res.redirect('/');
            } else {
                console.log(err);
            }
        });
    });
});

// Delete a character
app.delete("/:id", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as id ${connection.threadId}`);

        connection.query("DELETE from characters WHERE id = ?", [req.params.id], (err, rows) => {
            connection.release(); // return the connection pool

            if (!err) {
                res.redirect("/")
            } else {
                console.log(err);
            }
        });
    });
});




// Listen on environment port or 5000

app.listen(port, () => {
    console.log(`Listen on ${port}`);
});
