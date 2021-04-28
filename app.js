var players = [
'Alice', 'Bob'  // TODO: set assert (no name twice!
];

var body_parts = [
    'left foot',
    'right foot',
    'left hand',
    'right hand',
    'left ellbow',
    'right elbow',
    'left knee',
    'right knee',
    'left ear',
    'right ear',
    'nose',
    'chin',
    'left heel',
    'right heel',
];

function refresh_settings_view () {
    var str = "";
    players.forEach(function(it) {
        str += "<tr><td>"+it+" </td><td><button onclick='remove_player(\""+it+"\")'>X</button></td></tr>";
    });
   $("#players").html(str);
}


function add_player() {

    var new_name = $("#new_player_name").val();
    if (players.indexOf(new_name) != -1) {
        alert("Not adding this player!\nA Player with the name " + new_name + "already exists!");
        return;
    }

    players.push(new_name);

    $("#new_player_name").val("");

    refresh_settings_view();

    $("#new_player_name").focus();

    store_to_cookie();

}



function remove_player(name) {
    var i = players.indexOf(name);
    if (i != -1) {
        players.splice(i, 1);
    }

    refresh_settings_view();
}

function get_new_sentence() {
    if (players.length < 2) {
        alert("Add more players to play!");
        return;
    }

    var player1 = choice(players);

    var other_players = Array.from(players);
    other_players.splice(players.indexOf(player1), 1);
    var player2 = choice(other_players);

    var body_part1 = choice(body_parts);
    var body_part2 = choice(body_parts);

    var sentence = player1 + " puts the "+ body_part1 + " on "+player2+"'s " + body_part2;
    return sentence;

}

window.onload = function () {
    $("#game").hide();

    load_from_cookie();
    refresh_settings_view();

    $("#new_player_name").keyup(function(evt) {
        if (evt.key == 'Enter') {
            add_player();
        }
    });
    $(document).keyup(function(evt) {
        if (evt.key == ' ') {
            refresh_sentence();
        } else if (evt.key == 't') {
            toggle_settings();
        }
    });

    var myShakeEvent = new Shake({
        threshold: 15, // optional shake strength threshold
        timeout: 500 // optional, determines the frequency of event generation
    });

    myShakeEvent.start();  // start listening for shake event...

    window.addEventListener('shake', function() {
        console.log("Shake event!");
        refresh_sentence();
    }, false);

    if (! window.speechSynthesis) {
        $("#has_audio_output_div").prop('checked', false);
        $("#has_audio_output_div").css("display", "none");
        $("#has_audio_output_div").hide();
    }
}

function choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function load_from_cookie() {
    var m = {};
    try {
        m = JSON.parse(document.cookie.split("; ")[1]);
    } catch (e) {};
    console.log('m', m);
    if (m.players === undefined || m.players.length < 1)
    {
        console.log('Cannot restore settings from cookies');
        return;
    }
    console.log('Restoring settings from cookies');
    players = m.players;
}

function store_to_cookie() {
    console.log('store settings to cookie');
    document.cookie = JSON.stringify({'players': players});
}

var has_settings = true;
var interval = -1;
function toggle_settings() {
    has_settings = !has_settings;

    if (!has_settings) {
        store_to_cookie();
    }

    if (has_settings && interval != -1) {
        // deactivate automode
        $("#has_auto_mode").prop("checked", false);
        toggle_auto_mode();
    }

    $("#settings").toggle();
    $("#game").toggle();
}

function toggle_auto_mode() {
    if (interval === -1) {
        interval = setInterval(refresh_sentence, 10000);
    } else {
        clearInterval(interval);
        interval = -1;
    }
}

function refresh_sentence() {
    if (!$('#settings').is(":visible")) {
        var new_sentence = get_new_sentence();
        if ($("#has_audio_output").prop("checked")) {
            var msg = new SpeechSynthesisUtterance();
            msg.text = new_sentence;
            window.speechSynthesis.speak(msg);
        }
        $('#sentence').text(new_sentence);

    }
}
