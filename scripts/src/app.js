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

// Board
var Board = Pong.extend({

    draw: function  () {
        var context = this.get("context"),
            position = this.get("position"),
            size = this.get("size");

        context.strokeRect(position.x, position.y, size.w, size.h);
    }

});

return {
    Pong: Pong,
    Board: Board
}

});