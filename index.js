// Importing express module
import express, { query } from 'express';
import querystring from 'querystring';
import axios from 'axios';
const port = 1337;
const app = express();
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

app.get("/player", (req, res) => {
        return res.redirect("player.html");
});

app.get("/auth", (req, res) => {
        const code = req.query.code;
        const state = req.query.state;
        const client_id = '273447d19d2041f7860098e36f9da364'
        const client_secret = 'cf14da35b6634da89a0593edf9f61237'
        const redirect_uri = 'http://localhost:1337/auth'
        const authorization_header = `Authorization: Basic ${(`client_id+':'+code`).toString('base64')}`
        const url = 'https://accounts.spotify.com/api/token'

        axios({
                method: 'post',
                url: 'https://accounts.spotify.com/api/token',
                data: querystring.stringify({
                        code: code,
                        redirect_uri: redirect_uri,
                        grant_type: 'authorization_code'
                }),
                headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${new Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`
                },
                json: true
              }).then(response => {
                        if (response.status === 200) {
                                res.cookie('token', `${response.data["access_token"]}`)
                                res.redirect("player");
                        } else {
                                res.send(response);
                        }
              })
});


app.get('/', function(req, res) {
        var state = randomString(16);
        var scope = 'user-read-private user-read-email app-remote-control user-modify-playback-state playlist-read-private playlist-read-collaborative streaming';
        var uri = 'http://localhost:1337/auth'
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
