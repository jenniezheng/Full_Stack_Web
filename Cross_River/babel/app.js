/*
Compiling es6 to es5 with babel
*/
const tile_width=100;
const tile_height=tile_width*.85;
const height_offset=-.3*tile_height;
//row, col are zero indexed
//0,0 is at top left corner
const num_rows=6;
const num_cols=5;
const player_start_row=5;
const player_start_col=2;
//default enemy speed in terms of num tiles per second
//enemy speed varies depending on chance and level but
//is generally based on this number
const default_enemy_speed=.5;
//how close counts as collision
const sensitivity_row=.5;
const sensitivity_col=.5;
//inclusive enemy range
const enemy_min_row=1;
const enemy_max_row=3;
const total_starting_enemies=3;

let enemies_row_sorted=[[],[],[],[],[],[]]; //faster collision detection by only searching in row
let allEnemies=[]
let level=1;
let player;

/*
Position Class
*/
class Position {
  constructor({row=0,col=0}) {
    this.row=row;
    this.col=col;
  }
  getY(){
        return this.row*tile_height+height_offset;
  };
  getX(){
    return this.col*tile_width;
  };
  inbounds(row,col){
    return ( 0<=row && row <= num_rows-1 &&
         0<=col && col <= num_cols-1);
  };
  moveRow(num){
    let newRow=num+this.row;
    if(this.inbounds(newRow,this.col)){
        this.row=newRow;
        return true;
    }
    return false;
    }
  moveCol(num){
    let newCol=num+this.col;
    if(this.inbounds(this.row,newCol)){
        this.col=newCol;
        return true;
    }
    return false;
  }
  //checks whether two positions are colliding
  collided(other){
        return (Math.abs(other.row-this.row) < sensitivity_row &&
            Math.abs(other.col-this.col) < sensitivity_col);
   }
}

/*
Enemy Class
*/
class Enemy {
  constructor({speed=default_enemy_speed,position,sprite='images/enemy-bug.png'}={}) {
    this.speed = speed;
    this.position = position;
    this.sprite = sprite;
    //left if negative 1, right if 1
    this.direction = 1;
  }
  // Update the enemy, required method for game
  update(dt){
    let result=this.position.moveCol(this.direction*this.speed*dt);
    if(!result) this.direction= - this.direction;
  };
  // Draw the enemy on the screen, required method for game
  render(){
    ctx.drawImage(Resources.get(this.sprite), this.position.getX(), this.position.getY());
  };
}

/*
Player Class
*/
class Player {
  constructor() {
    this.sprite = 'images/char-boy.png';
    this.position = new Position({row:player_start_row, col:player_start_col});
  }
  // Update the player, required method for game
  update(dt){
    if(this.won()){
        level_up();
    }
    if(this.collided()){
        //just in case it doesn't look like collision occured yet.
        this.reset_position();
    }
  };
  // Draw the player on the screen, required method for game
  render(){
    ctx.drawImage(Resources.get(this.sprite), this.position.getX(), this.position.getY());
  };
  handleInput(direction){
    if(direction=='left'){
        this.position.moveCol(-1);
    }
    else if (direction=='right'){
        this.position.moveCol(1);
    }
    else if (direction=='up'){
        this.position.moveRow(-1);
    }
    else if (direction=='down'){
        this.position.moveRow(1);
     };
    }
    collided(){
        //get enemies in current row
        let enemies_in_current_row=enemies_row_sorted[this.position.row];
        for (let index in enemies_in_current_row){
            let enem=enemies_in_current_row[index];
            if (this.position.collided(enem.position))
                return true;
        }
        return false;
    }
    won(){
        return this.position.row==0;
    }
    reset_position(){
        this.position.row=player_start_row;
        this.position.col=player_start_col;
    }
}

/*
levels up by creating new enemy
*/
function level_up(){
    level+=1;
    alert("You won level "+level+"!");
    player.position.reset();
    let enemy=create_enemy();
    enemies_row_sorted[enemy.position.row].push(enemy);
    allEnemies.push(enemy);
}

/*
Random functions used by the create enemy function
*/
function getRandomNonInteger(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max-min)) +min;
}

function create_enemy(){
    let row=getRandomInteger(enemy_min_row,enemy_max_row+1);
    let col=getRandomInteger(0,num_cols);
    let position=new Position({row,col});
    //faster enemies start appearing later
    let speed=getRandomNonInteger(-.3,.5+level*.1)+default_enemy_speed;
    let enemy=new Enemy({speed,position});
    return enemy;
}

/*
initiates the level by creating the player and enemies,
and tracking them
*/
function init(){
    for (let i=0; i<total_starting_enemies; i++){
        //spawn enemies with random rows and cols
        //and .1 to getRandomInt end range since end range is exclusive
        let enemy=create_enemy();
        enemies_row_sorted[enemy.position.row].push(enemy);
        allEnemies.push(enemy);
    }
    player=new Player();
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});



init();