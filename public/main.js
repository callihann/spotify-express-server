var slider = document.getElementById("volRange");
var r = document.querySelector('html');

function getCookie(name) { // https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
}

window.onSpotifyWebPlaybackSDKReady = () => {
        const token = getCookie('token')
        const player = new Spotify.Player({
                name: 'Spotify Web Player',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
});

function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }
      
function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function changeBackground(color) {
        document.body.style.background = color;
}
     
var currState = {}
function update() {
        player.getCurrentState().then(state => {
                if (!state) {
                        console.error('User is not playing music through the Web Playback SDK');
                        return;
                }
                currState.paused = state.paused;
                currState.position = state.position;
                currState.duration = state.duration;
                currState.updateTime = performance.now()
                document.getElementById("trackname").innerHTML = state.track_window.current_track['name'];
                document.getElementById("artistname").innerHTML = state.track_window.current_track['artists'][0]['name'];
                document.getElementById("artistname").href = 'http://open.spotify.com/artist/' + (state.track_window.current_track['artists'][0]['uri']).replace('spotify:artist:', '')
                document.getElementById("image").src=state.track_window.current_track['album']['images'][0]['url'];

                var v = new Vibrant(state.track_window.current_track['album']['images'][0]['url']);
                v.getPalette((err, palette) => changeBackground(rgbToHex(palette['DarkMuted']['_rgb'][0], palette['DarkMuted']['_rgb'][1], palette['DarkMuted']['_rgb'][2])))
                document.getElementById("progress-bar").style.width = "0%";
        });
}

function getStatePosition() { // https://github.com/spotify/web-playback-sdk/issues/106
        if (currState.paused) {
                return currState.position;
        }
        let position = currState.position + (performance.now() - currState.updateTime) / 1000;
        return position > currState.duration ? currState.duration : position;
}

slider.oninput = function() {
        player.setVolume((document.getElementById("volRange").value) / 100)
}

setInterval(function() { updatePosition() }, 1);
function updatePosition() {
        const pos_val = getStatePosition();
        if (100 < document.getElementById("progress-bar").style.width) {
                document.getElementById("progress-bar").style.width = "0%";
        }
        document.getElementById("progress-bar").style.width = Math.trunc((pos_val / currState.duration) * 100000) + "%";
}

// Ready
player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
});

// Not Ready
player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
});

player.addListener('initialization_error', ({ message }) => {
        console.error(message);
});

player.addListener('authentication_error', ({ message }) => {
        console.error(message);
        window.location.replace("/");
});

player.addListener('account_error', ({ message }) => {
        console.error(message);
});

document.getElementById('togglePlay').onclick = function() {
        player.togglePlay();
};

document.getElementById('skip').onclick = function() {
        player.nextTrack();
};

document.getElementById('back').onclick = function() {
        player.previousTrack();
};

player.addListener('player_state_changed', update);

document.addEventListener("keypress", function onEvent(event) {
        if (event.key == "D" || event.key == "d") {
                player.nextTrack();
        }
        else if (event.key == "A" || event.key == "a") {
                player.previousTrack();
        }
        else if (event.key == "S" || event.key == "s" || event.key == "32") {
                player.togglePlay();
        }
});

player.connect();
}