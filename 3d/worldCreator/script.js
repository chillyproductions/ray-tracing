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
var gameObejcts = [];
var keyPressed = {left:0,right:0,s:0,w:0,d:0,a:0};
var createType = "box";

var controlType2D = false;


function listen(){
    document.addEventListener('keydown',({key})=>{
        key = key.toLocaleLowerCase();
        key = key.replace("arrow","");
        keyPressed[key] = 1;

        if(key == " ")
            for(let gameObject of gameObejcts)
                if(gameObject.moveble)
                    gameObject.activate();
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
            s+=`<td onclick='createObject(this.id)' id=${row*5+colm} style='width:50px; height:50px; border:1px solid'></td>`;
        }
        s+= "</tr>"
    }
    document.querySelector('table').innerHTML = s;;
}

function createObject(id){
    
    var row = Math.floor(id / boxAmount);
    var colm = id % boxAmount;
    
    switch(createType){
        case "box":
            gameObejcts.push(new Box(chunkSize * colm,chunkSize * row,1,1));
            document.getElementById(id).style.backgroundColor = 'green';
            break;
        case "h-door":
            gameObejcts.push(new Door(row,colm,true));
            document.getElementById(id).style.backgroundColor = 'blue';
            break;
        case "v-door":
            gameObejcts.push(new Door(row,colm,false));
            document.getElementById(id).style.backgroundColor = 'blue';
    }   
}

function changeCreateType(type){
    createType = type;
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

        for(let gameObject of gameObejcts){
            let walls = gameObject.getWalls();
            for(let wall of walls)
                wall.draw();
            if(gameObject.moveble)
                gameObject.move();
        }
    },50)
}

function draw3D(length,i,ang,texture){
    // let distancePercent = 1- Math.min(Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)) / getH(ang),1);
    if(length >= viewDistance-1)
        return;

    let distancePercent = 30*wallHeight/length;
    distancePercent = distancePercent * getH(ang);

    const height = distancePercent*wallHeight*canvas3d.height;
    const pxSize = height/texture.length;

    // ctx3d.fillStyle = `hsl(${texture[0][0]}, ${texture[0][1]}%, ${(Math.min(distancePercent*3,1)*50)}%)`;
    // ctx3d.fillRect(i*canvas3d.width/rayCount, (canvas3d.height-height)/2, canvas3d.width/rayCount, height);
    
    for(let y = 0; y < texture.length; y++){
        ctx3d.fillStyle = `hsl(${texture[y][0]}, ${texture[y][1]}%, ${(Math.min(distancePercent*3,1)*50)}%)`;
        ctx3d.fillRect(i*canvas3d.width/rayCount, (canvas3d.height-height)/2 + y*pxSize, canvas3d.width/rayCount, Math.ceil(pxSize));
    }
}

function getH(ang){
    return (Math.sin((90-fov/2)*Math.PI/180)) / (Math.sin((90-ang+fov/2)*Math.PI/180));
}

function drawFloor(){
    ctx3d.fillStyle = 'blue';
    ctx3d.fillRect(0, canvas3d.height/2, canvas3d.width, canvas3d.height/2);
}

start();