const canvas2d = document.getElementById("2d");
const ctx2d = canvas2d.getContext('2d');
const canvas3d = document.getElementById("3d");
const ctx3d = canvas3d.getContext('2d');

const rayCount = 250;
const viewDistance = 1000;
const fov = 80;
const wallHeight = 1.3;
const boxAmount = 5;
const chunkSize = canvas3d.width/boxAmount;

var player;
var boxes = [];
var keyPressed = {left:0,right:0,s:0,w:0,d:0,a:0};

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

    var row = Math.floor(id / boxAmount);
    var colm = id % boxAmount;

    boxes.push(new Box(chunkSize * colm,chunkSize * row,1,1));
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

function draw3D(x1,y1,x2,y2,i,ang){
    // let distancePercent = 1- Math.min(Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)) / getH(ang),1);
    if(Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)) >= viewDistance-1)
        return;

    let distancePercent = 30*wallHeight/Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
    distancePercent = distancePercent * getH(ang);
    ctx3d.fillStyle = `hsl(240, 20%, ${(Math.min(distancePercent*3,1)*50)}%)`;
    ctx3d.fillRect(i*canvas3d.width/rayCount, (canvas3d.height-distancePercent*wallHeight*canvas3d.height)/2, canvas3d.width/rayCount, distancePercent*wallHeight*canvas3d.height);
}

function getH(ang){
    return (Math.sin((90-fov/2)*Math.PI/180)) / (Math.sin((90-ang+fov/2)*Math.PI/180));
}

console.log(getH(0))
console.log(getH(60))
console.log(getH(80))

function drawFloor(){
    ctx3d.fillStyle = 'blue';
    ctx3d.fillRect(0, canvas3d.height/2, canvas3d.width, canvas3d.height/2);
}

start();