const canvas2d = document.getElementById("2d");
const ctx2d = canvas2d.getContext('2d');
const canvas3d = document.getElementById("3d");
const ctx3d = canvas3d.getContext('2d');

const rayCount = 250;
const viewDistance = 500;
const fov = 30;

var player;
var walls = [new Wall(0,0,canvas2d.width,0),new Wall(0,0,0,canvas2d.height),new Wall(canvas2d.width,0,canvas2d.width,canvas2d.height),new Wall(0,canvas2d.height,canvas2d.width,canvas2d.height)]
var keyPressed = {left:0,right:0,up:0,down:0,d:0,a:0};

var controlType2D = false;

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

    walls = [...walls,new Wall(100,100,100,300),new Wall(50,12,400,200), new Wall(350,400,244,199)];
    player = new Player(100,100);
    setInterval(()=>{
        ctx2d.clearRect(0,0,canvas2d.width,canvas2d.height);
        ctx3d.clearRect(0,0,canvas3d.width,canvas3d.height)

        drawFloor();
        player.move();
        player.draw();
        player.drawRays();

        for(let wall of walls){
            wall.draw();
        }
    },50)
}

function draw3D(x1,y1,x2,y2,i){
    let distancePercent = 1-((Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))) / viewDistance);
    ctx3d.fillStyle = `hsl(240, 20%, ${(100-distancePercent*100)}%)`;
    ctx3d.fillRect(i*canvas3d.width/rayCount, (canvas3d.height-distancePercent*canvas3d.height)/2, canvas3d.width/rayCount, distancePercent*canvas3d.height);
    
    
}

function drawFloor(){
    ctx3d.fillStyle = 'blue';
    ctx3d.fillRect(0, canvas3d.height/2, canvas3d.width, canvas3d.height/2);
}

start();