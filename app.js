var players = [
'Alice', 'Bob'  // TODO: set assert (no name twice!
];

var body_parts = ['fuss','hand','kopf','bauch'];


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

}



function remove_player(name) {
    console.log('asdf');
    var i = players.indexOf(name);
    if (i != -1) {
        players.splice(i, 1);
    }

    refresh_settings_view();
}

function onload() {
    $("#game").hide();
    console.log('adsf');

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


    window.addEventListener('shake', function() {
        console.log("Shake event!");
        new_round();
    }, false);

}

function choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}



function new_round() {
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

function toggle_settings() {
    $("#settings").toggle();
    $("#game").toggle();
}

function refresh_sentence() {
    if (!$('#settings').is(":visible")) {
        $('#sentence').text(new_round());
    }
}

