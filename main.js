(function () {

    var pong = (function  () {

        var app = {

            setup: function  (context, config) {
                var board = new Board(config);

                // register the event
                document.addEventListener('keydown', function  () {
                    // throws the move command to all the players
                    // the player whose the configuration matches, will handle it
                    board.players.forEach(function  (player) {
                        // if the player has the key configured, move it!
                        if (player.keymatch(event.keyCode)) {
                            draw_something('clearRect', player.config);
                            player.move(event.keyCode);
                            draw_something('fillRect', player.config);
                        }
                    });
                });

                // public attrs
                this.context = context;
                this.board = board;
            },

            draw: function  () {
                // draw the board
                draw_something('strokeRect', this.board.config);

                // draw the players
                this.board.players.forEach(function  (player) {
                    draw_something('fillRect', player.config);
                });
            },

        };

        /*
         * draw function for the pong app
         */
        function draw_something (methodname, config) {
            app.context[methodname](config.x, config.y, config.w, config.h);
        }

        /*
         * The board, where the shit happens!
         */
        function Board (config) {

            var players = [];

            var playersize = 50;
            var playerheight = 20;
            var x = calculate_position(config.w);
            var y = calculate_position(config.h);

            var slots = [

                /* x axis */
                {x: x.pos, y: x.regular, w: playersize, h: playerheight, axis: 'x'}, // top
                {x: x.pos, y: x.inverted, w: playersize, h: playerheight, axis: 'x'}, // down

                /* y axis */
                {x: y.regular, y: y.pos, w: playerheight, h: playersize, axis: 'y'}, // left
                {x: y.inverted, y: y.pos, w: playerheight, h: playersize, axis: 'y'} // right

            ];

            /*
            * configure the players
            *
            * 4 slots, 4 players
            * configura e desenha os players
            */
            slots.forEach(function  (slot) {
                // configure the player
                var player = new Player(slot);

                // add the to the board
                players.push(player);
            });

            function calculate_position (size) {

                return {
                  pos: (size - playersize) / 2,
                  regular: 10,
                  inverted: size - playerheight - 10
                };

            }

            this.config = config;
            this.players = players;
        }

        /*
         * The Player
         */
        function Player (config) {

            // size and position
            this.config = config;

            // left a, right d
            this.control = {left: 65, right: 68};

            var axis = this.config['axis'];

            this.keymatch = function  (key) {
                return this.control.left == key || this.control.right == (key);
            };

            this.move = function  (key) {
                switch (key) {
                    case this.control.left:
                        this.config[axis] -= 4;
                        break;
                    case this.control.right:
                        this.config[axis] += 4;
                        break;
                }
            };
        }

    return app;
  })();

  var context = document.querySelector('#pongbox').getContext('2d');

  pong.setup(context, {x: 0, y: 0, w: 500, h: 500});
  pong.draw();
  
  window.pong = pong;
})();