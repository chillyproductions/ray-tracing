const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

var walls;

var keyPressed = {left:0,right:0,up:0,down:0};

function listen(){
    document.addEventListener('keydown',({key})=>{
        key = key.toLocaleLowerCase();
        key = key.replace("arrow","");
        keyPressed[key] = 1;
    })
    document.addEventListener('keyup',({key})=>{
        key = key.toLocaleLowerCase();
        key = key.replace("arrow","");
        keyPressed[key] = 0;
    })
}

function start(){
    listen();

    walls = [new Wall(100,100,100,300),new Wall(50,12,400,200), new Wall(350,400,244,199)];
    var player = new Player(100,100,100);
    setInterval(()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);

        player.move();
        player.draw();
        player.drawRays();

        for(let wall of walls){
            wall.draw();
        }
    },20)
}

start();