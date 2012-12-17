define(['lib/backbone'], function (Backbone) {

// Main object
var Pong = Backbone.Model.extend({

    // model attributes
    defaults: {

        // the canvas context
        "context": null,

        // object positions
        "position": {"x": 0, "y": 0},

        // object size
        "size": {"w": 0, "h": 0}

    },

    // Draws the object
    draw: function  () {},

    // Action performed on hit
    on_hit: function  (object) {},

    // Get the posisitions ocupied by the object
    get_area: function () {},

    // Test the hit with the another_object for the current position
    hit_test: function (another_object) {}

});

// Players
var Player = Pong.extend({

    // new parameters
    // move_axis:  x or y
    initialize: function  () {

        // players configuration
        switch (this.get('id')) {

            // player 1
            case '1':
                this.configure("x", {"w": 100, "h": 20});
                break;

            // player 2
            case '2':
                this.configure("y", {"w": 20, "h": 100});
                break;

        }
        
        // event
        this.on("movement_call", this.move);
    },


    configure: function (axis, size) {

        var board = this.get("board");

        function get_position (axis, relativesize) {
            var offset = 10,
                board_size = board.get("size"),
                board_position = board.get("position");

            var position = {};

            position[axis[0]] = ((board_size[relativesize] - size[relativesize]) / 2) + board_position[axis[0]];
            position[axis[1]] = board_position[axis[1]] + offset + board_size[relativesize];

            return position;
        }

        if (axis == "x") {
            var position = get_position(["x", "y"], "w");
        } else {
            var position = get_position(["y", "x"], "h");
        }

        // configure the player 
        this.set("move_axis", axis);
        this.set("size", size);
        this.set("position", position);
    },

    // move the player towards a 'direction'
    move: function  (direction) {
        var position = this.get("position"),
            base = position[this.get("move_axis")];

        switch (direction) {
            case this.get('movement_config').left:
                base -= 4;
                break;
            case this.get('movement_config').right:
                base += 4;
                break;
        }

        this.clear();

        position[this.get('move_axis')] = base;

        this.draw();
    },

    // clears the player position
    clear: function  () {
        var context = this.get("context"),
            position = this.get("position"),
            size = this.get("size");

        context.clearRect(position.x, position.y, size.w, size.h);
    },

    // draw the player
    draw: function  () {
        var context = this.get("context"),
            position = this.get("position"),
            size = this.get("size");

        context.fillRect(position.x, position.y, size.w, size.h);
    },

});

// Board
var Board = Pong.extend({

    // draw the board
    draw: function  () {

        // vars
        var context = this.get("context"),
            position = this.get("position"),
            size = this.get("size"),
            board = this;

        // draws the board
        context.strokeRect(position.x, position.y, size.w, size.h);

        // configure players
        this.set('players', []);

        function init_player (id, mov_config) {

            var player = new Player({
                context: context,
                board: board,
                id: id,
                movement_config: mov_config
            });

            board.get('players').push(player);

            player.draw();
        }

        init_player("1", {left: 65, right: 68});
        init_player("2", {left: 65, right: 68});
    }

});

return {
    Pong: Pong,
    Board: Board,
    Player: Player
}

});