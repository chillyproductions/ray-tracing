const canvas2d = document.getElementById("2d");
const ctx2d = canvas2d.getContext('2d');
const canvas3d = document.getElementById("3d");
const ctx3d = canvas3d.getContext('2d');

const rayCount = 250;
const viewDistance = 500;
const fov = 30;
const boxAmount = 5;

var player;
var boxes = [];
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

function createTable(){
    var s = "";
    for(let row = 0 ; row < boxAmount; row++){
        s+= "<tr>"
        for(let colm = 0; colm < boxAmount; colm++){
            s+=`<td onclick='createBox(this.id)' id=${row*5+colm} style='width:50px; height:50px; border:1px solid'></td>`;
        }
        s+= "</tr>"
    }
    document.querySelector('table').innerHTML = s;;
}

function createBox(id){
    document.getElementById(id).style.backgroundColor = 'green';

    var row = Math.floor(id / 5);
    var colm = id % 5;

    boxes.push(new Box(row,colm));
}

function start(){
    listen();
    createTable();

    player = new Player(100,100);
    setInterval(()=>{
        ctx2d.clearRect(0,0,canvas2d.width,canvas2d.height);
        ctx3d.clearRect(0,0,canvas3d.width,canvas3d.height)

        drawFloor();
        player.move();
        player.draw();
        player.drawRays();

        for(let box of boxes){
            let walls = box.getWalls();
            for(let wall of walls)
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