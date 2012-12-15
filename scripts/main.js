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

    var context = document.getElementById("myCanvas").getContext("2d");

    var board = new app.Board({
        context: context,
        position: {"x": 50, "y": 50},
        size: {"w": 700, "h": 400}
    });

    board.draw();
});