// Importing express module
var express = require("express");
var querystring = require('querystring');

// Importing mongoose module
var mongoose = require("mongoose");
const { request } = require("http");
const port = 1337;
const app = express();

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

function randomString(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+=-';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
 }
randomString(4);

// Handling the get request
app.get("/player", (req, res) => {
        print(res)
        return res.redirect("player.html");
});

app.post("/callback", (req, res, client_secret) => {
        var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                headers: {
                  'Authorization': 'Basic ' + (new (client_id + ':' + client_secret).toString('base64'))
                },
                form: {
                  grant_type: 'client_credentials'
                },
                json: true
        };
        request.post(authOptions, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                        var token = body.access_token
                }
})});

app.get('/', function(req, res) {
        var state = randomString(16);
        var scope = 'user-read-private user-read-email app-remote-control user-modify-playback-state playlist-read-private playlist-read-collaborative';
        var uri = 'http://localhost:1337/callback'
        res.redirect('https://accounts.spotify.com/authorize?' +
                querystring.stringify({
                        response_type: 'code',
                        client_id: '273447d19d2041f7860098e36f9da364',
                        scope: scope,
                        redirect_uri: uri,
                        state: state
                }));
      });

app.listen(port, () => {
        console.log(`The application started successfully on port ${port}`);
});
