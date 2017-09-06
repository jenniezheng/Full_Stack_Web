'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
Compiling es6 to es5 with babel
*/
var tile_width = 100;
var tile_height = tile_width * .85;
var height_offset = -.3 * tile_height;
var num_rows = 6;
var num_cols = 5;
var player_start_row = 5;
var player_start_col = 2;
//in terms of num tiles
var default_enemy_speed = .5;
//how close counts as collision
var sensitivity_row = .5;
var sensitivity_col = .5;
//inclusive enemy range
var enemy_min_row = 1;
var enemy_max_row = 3;
var total_starting_enemies = 3;

var enemies_row_sorted = [[], [], [], [], [], []]; //faster collision detection by only searching in row
var allEnemies = [];
var level = 1;
var player = void 0;

var Position = function () {
    function Position(_ref) {
        var _ref$row = _ref.row,
            row = _ref$row === undefined ? 0 : _ref$row,
            _ref$col = _ref.col,
            col = _ref$col === undefined ? 0 : _ref$col;

        _classCallCheck(this, Position);

        this.row = row;
        this.col = col;
    }

    _createClass(Position, [{
        key: 'getY',
        value: function getY() {
            return this.row * tile_height + height_offset;
        }
    }, {
        key: 'getX',
        value: function getX() {
            return this.col * tile_width;
        }
    }, {
        key: 'inbounds',
        value: function inbounds(row, col) {
            return 0 <= row && row <= num_rows - 1 && 0 <= col && col <= num_cols - 1;
        }
    }, {
        key: 'moveRow',
        value: function moveRow(num) {
            var newRow = num + this.row;
            if (this.inbounds(newRow, this.col)) {
                this.row = newRow;
                return true;
            }
            return false;
        }
    }, {
        key: 'moveCol',
        value: function moveCol(num) {
            var newCol = num + this.col;
            if (this.inbounds(this.row, newCol)) {
                this.col = newCol;
                return true;
            }
            return false;
        }
    }, {
        key: 'collided',
        value: function collided(other) {
            return Math.abs(other.row - this.row) < sensitivity_row && Math.abs(other.col - this.col) < sensitivity_col;
        }
    }]);

    return Position;
}();

var Enemy = function () {
    function Enemy() {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref2$speed = _ref2.speed,
            speed = _ref2$speed === undefined ? default_enemy_speed : _ref2$speed,
            position = _ref2.position,
            _ref2$sprite = _ref2.sprite,
            sprite = _ref2$sprite === undefined ? 'images/enemy-bug.png' : _ref2$sprite;

        _classCallCheck(this, Enemy);

        this.speed = speed;
        this.position = position;
        this.sprite = sprite;
        //left if negative 1, right if 1
        this.direction = 1;
    }
    // Update the enemy, required method for game


    _createClass(Enemy, [{
        key: 'update',
        value: function update(dt) {
            var result = this.position.moveCol(this.direction * this.speed * dt);
            if (!result) this.direction = -this.direction;
        }
    }, {
        key: 'render',

        // Draw the enemy on the screen, required method for game
        value: function render() {
            ctx.drawImage(Resources.get(this.sprite), this.position.getX(), this.position.getY());
        }
    }]);

    return Enemy;
}();

var Player = function () {
    function Player() {
        _classCallCheck(this, Player);

        this.sprite = 'images/char-boy.png';
        this.position = new Position({ row: player_start_row, col: player_start_col });
    }
    // Update the player, required method for game


    _createClass(Player, [{
        key: 'update',
        value: function update(dt) {
            if (this.won()) {
                alert("You won level " + level + "!");
                this.reset_position();
                level_up();
            }
            if (this.collided()) {
                //just in case it doesn't look like collision occured yet.
                this.reset_position();
            }
        }
    }, {
        key: 'render',

        // Draw the player on the screen, required method for game
        value: function render() {
            ctx.drawImage(Resources.get(this.sprite), this.position.getX(), this.position.getY());
        }
    }, {
        key: 'handleInput',
        value: function handleInput(direction) {
            if (direction == 'left') {
                this.position.moveCol(-1);
            } else if (direction == 'right') {
                this.position.moveCol(1);
            } else if (direction == 'up') {
                this.position.moveRow(-1);
            } else if (direction == 'down') {
                this.position.moveRow(1);
            };
        }
    }, {
        key: 'collided',
        value: function collided() {
            //get enemies in current row
            var enemies_in_current_row = enemies_row_sorted[this.position.row];
            for (var index in enemies_in_current_row) {
                var enem = enemies_in_current_row[index];
                if (this.position.collided(enem.position)) return true;
            }
            return false;
        }
    }, {
        key: 'won',
        value: function won() {
            return this.position.row == 0;
        }
    }, {
        key: 'reset_position',
        value: function reset_position() {
            this.position.row = player_start_row;
            this.position.col = player_start_col;
        }
    }]);

    return Player;
}();

function getRandomNonInteger(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function level_up() {
    level += 1;
    var enemy = create_enemy();
    enemies_row_sorted[enemy.position.row].push(enemy);
    allEnemies.push(enemy);
}

function create_enemy() {
    var row = getRandomInteger(enemy_min_row, enemy_max_row + 1);
    var col = getRandomInteger(0, num_cols);
    var position = new Position({ row: row, col: col });
    //faster enemies start appearing later
    var speed = getRandomNonInteger(-.3, .5 + level * .1) + default_enemy_speed;
    var enemy = new Enemy({ speed: speed, position: position });
    return enemy;
}

function init() {
    for (var i = 0; i < total_starting_enemies; i++) {
        //spawn enemies with random rows and cols
        //and .1 to getRandomInt end range since end range is exclusive
        var enemy = create_enemy();
        enemies_row_sorted[enemy.position.row].push(enemy);
        allEnemies.push(enemy);
    }
    player = new Player();
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

init();
