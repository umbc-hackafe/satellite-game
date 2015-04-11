var ui;
var canvas2d;
var canvas32;

var game;

function update(timestamp) {
    requestAnimationFrame(update);

    game.update(timestamp);
}

$(document).ready(function() {
    ui = $('#ui');
    canvas2d = $('#canvas2D');
    canvas3d = $('#canvas3D');

    // disable context menu
    $(document).on('contextmenu', function() { return false; });

    $(window).resize(function() { game.resize(); });

    game = new Game();

    requestAnimationFrame(update);
});
