
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

var currState = {}
function update(changedStateEvent) {
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
                document.getElementById("image").src=state.track_window.current_track['album']['images'][0]['url'];
        });
}

function getStatePosition() { // https://github.com/spotify/web-playback-sdk/issues/106
        if (currState.paused) {
                return currState.position;
        }
        let position = currState.position + (performance.now() - currState.updateTime) / 1000;
        return position > currState.duration ? currState.duration : position;
}


var slider = document.getElementById("volRange");
slider.oninput = function() {
        player.setVolume((document.getElementById("volRange").value)/100)
}

var pos_slider = document.getElementById("position");   
pos_slider.oninput = function() { // if the 
        console.log((currState.duration) / pos_slider.value);
        player.seek((currState.duration) / pos_slider.value);
};

setInterval(function() { updatePosition() }, 500);
function updatePosition() {
        // console.log((getStatePosition() / currState.duration) * 100)
        document.getElementById("position").value = ((getStatePosition() / currState.duration) * 100);
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

player.connect();
}