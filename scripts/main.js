requirejs.config({
    baseUrl: "scripts",
    shim: {
        "lib/backbone": {
            deps: ["lib/underscore", "lib/jquery"],
            exports: "Backbone"
        }
    }
});

requirejs(["src/app"], function (app) {

    // canvas 2d context
    var context = document.getElementById("myCanvas").getContext("2d");

    // configure the board
    var board = new app.Board({
        context: context,
        position: {"x": 50, "y": 50},
        size: {"w": 200, "h": 200}
    });

    // draws the board
    board.draw();

    // main event
    $(document).ready(function(){
        $(document).keydown(function(event){
            board.get('players').forEach(function  (player) {
                player.trigger("movement_call", event.keyCode);
            });
        });
    });

});