// Importing express module
import express from 'express';
import got from 'got';
import querystring from 'querystring';
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
randomString(4);

app.get("/player", (req, res) => {
        print(res)
        return res.redirect("player.html");
});

app.get("/auth", (req, res) => {
        const code = req.query.code;
        const state = req.query.state;
        const cid = '273447d19d2041f7860098e36f9da364'
        var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                headers: {
                        'Authorization': 'Bearer ' + ((cid + ':' + code).toString('base64'))
                },
                form: {
                        grant_type: 'client_credentials'
                },
                json: true
        };
        const {data} = got.post('https://accounts.spotify.com/api/token', {
                headers: {
                        'Authorization': `Bearer ${(cid + ':' + code).toString('base64')}`
                },
                form: {
                        grant_type: 'client_credentials'
                },
                json: true
        }).json();

        res.send(data)
        // request.post(authOptions, function(error, response, body) {
        //         if (!error && response.statusCode === 200) {
        //               var token = body.access_token
        //                 res.send(token)
        //         }
        // res.send({'code':code, 'state': state}); 
});


app.get('/', function(req, res) {
        var state = randomString(16);
        var scope = 'user-read-private user-read-email app-remote-control user-modify-playback-state playlist-read-private playlist-read-collaborative';
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
