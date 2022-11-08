// Importing express module
var express = require("express");


// Importing mongoose module
var mongoose = require("mongoose");
const port = 1337;
const app = express();

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Handling the get request
app.get("/", (req, res) => {
        return res.redirect("player.html");
});

// Starting the server on the 80 port
app.listen(port, () => {
        console.log(`The application started successfully on port ${port}`);
});
