(function () {

    var pong = (function  () {

        var app = {

            setup: function  (context, config) {
                var board = new Board(config);

                // public attrs
                this.context = context;
                this.board = board;

                // register the event
                document.addEventListener('keydown', function  () {

                    // throws the move command to all the players
                    // the player whose the configuration matches, will handle it
                    board.players.forEach(function  (player) {

                        // if the player has the key configured, move it!
                        if (player.keymatch(event.keyCode)) {

                            // movement desired position
                            var intent_config = player.try(event.keyCode);

                            // the new position did not hit anything yet
                            var nohit = true;

                            // player with player hit test
                            // current player number
                            var i = 0;
                            while (board.players[i] && nohit) {

                                // get a player
                                var other = board.players[i];

                                // test if it is not the same players
                                if (other !== player) {
                                    // hit another player?
                                    if (config_hit(intent_config, other.config)) {
                                        // ok, there was a hit
                                        nohit = false;
                                    }
                                }

                                // next player
                                i++;
                            }

                            // board hit test
                            var nohit = nohit && !board_hit(intent_config);

                            if (nohit) {
                                // no conflicts, keep moving
                                player.move(event.keyCode);
                            }
                        }
                    });
                });
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
         * Calculates the area for hit testing
         */
        function calculate_area (config) {
            return {
                x: {i: config.x, f: config.x + config.w},
                y: {i: config.y, f: config.y + config.h}
            };
        }

        /*
         * Verify if there is conflict into two players configs
         */
        function config_hit (config_a, config_b) {

            function hit_axis (axis_a, axis_b) {

                function point_hit (point) {
                    return (
                        point >= axis_b.i
                        &&
                        point <= axis_b.f
                        );
                }

                return point_hit(axis_a.i) || point_hit(axis_a.f);
            }

            var area_a = calculate_area(config_a);
            var area_b = calculate_area(config_b);

            return ( 
                hit_axis(area_a.x, area_b.x)
                &&
                hit_axis(area_a.y, area_b.y)
                );

        }

        /*
         * Test the colision of a player config with the board
         */
        function board_hit (intent_config) {
            var board_area = calculate_area(app.board.config);
            var intent_area = calculate_area(intent_config);

            return (
                intent_area.x.i <= board_area.x.i
                ||
                intent_area.x.f >= board_area.x.f
                ||
                intent_area.y.i <= board_area.y.i
                ||
                intent_area.y.f > board_area.y.f
                );
        }

        /*
         * The board, where the shit happens!
         */
        function Board (config) {

            var players = [];

            var playersize = 50;
            var playerheight = 20;
            var x = calculate_position({offset_vert: config.y, offset_hor: config.x, size: config.w});
            var y = calculate_position({offset_vert: config.x, offset_hor: config.y, size: config.h});

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

            function calculate_position (axis) {

                var player_offset = 10;

                return {
                  pos: axis.offset_hor + (axis.size - playersize) / 2,
                  regular: axis.offset_vert + player_offset,
                  inverted: axis.offset_vert + axis.size - playerheight - player_offset
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

            this.try = function (key) {
                var config = Object.create(this.config);

                switch (key) {
                    case this.control.left:
                        config[axis] -= 4;
                        break;
                    case this.control.right:
                        config[axis] += 4;
                        break;
                }

                return config;
            }

            this.move = function (key) {
                draw_something('clearRect', this.config);

                this.config = this.try(key);

                draw_something('fillRect', this.config);
            };
        }

    return app;
  })();

  var context = document.querySelector('#pongbox').getContext('2d');

  pong.setup(context, {x: 20, y: 20, w: 500, h: 500});
  pong.draw();
  
  window.pong = pong;
})();