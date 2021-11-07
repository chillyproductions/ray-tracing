class Player{
    moveSpeed = 5;
    constructor(x,y,rayCount){
        this.x = x;
        this.y = y;
        this.rayCount = rayCount;
    }

    move(){
        this.x += (keyPressed.right - keyPressed.left) * this.moveSpeed;
        this.y += (keyPressed.down - keyPressed.up) * this.moveSpeed;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y,8, 0, 2 * Math.PI);
        ctx.fill();
    }
    drawRays(){
        for(let i = 0; i < this.rayCount; i++){
            var ray = new Ray(this.x,this.y,i*(2*Math.PI)/this.rayCount);
            ray.checkCollistion();
            ray.draw();
        }
    }
}

class Ray{
    maxDistance = 200;
    constructor(x,y,ang){
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + Math.cos(ang)*this.maxDistance;
        this.y2 = y + Math.sin(ang)*this.maxDistance;

        this.vissbleX2 = this.x2;
        this.vissbleY2 = this.y2;
    }
    draw(){
        ctx.beginPath();
        ctx.moveTo(this.x1,this.y1);
        ctx.lineTo(this.vissbleX2,this.vissbleY2);
        ctx.stroke();
    }
    checkCollistion(){
        let collistion = false;
        for(let wall of walls){
            let t = ((this.x1-wall.x1)*(wall.y1-wall.y2)-(this.y1-wall.y1)*(wall.x1-wall.x2))/((this.x1-this.x2)*(wall.y1-wall.y2)-(this.y1-this.y2)*(wall.x1-wall.x2));
            let u = ((this.x1-wall.x1)*(this.y1-this.y2)-(this.y1-wall.y1)*(this.x1-this.x2))/((this.x1-this.x2)*(wall.y1-wall.y2)-(this.y1-this.y2)*(wall.x1-wall.x2));

            if(u >= 0 && u <= 1 && t >=0 && t <= 1){
                let newX = this.x1 + t*(this.x2-this.x1);
                let newY = this.y1 + t*(this.y2-this.y1);
                if((newX-this.x1)*(newX-this.x1)+(newY-this.y1)*(newY-this.y1) < (this.vissbleX2-this.x1)*(this.vissbleX2-this.x1)+(this.vissbleY2-this.y1)*(this.vissbleY2-this.y1)){
                    this.vissbleX2 = newX;
                    this.vissbleY2 = newY;
                    collistion = true;
                }
            }
            else if(!collistion){
                this.vissbleX2 = this.x2;
                this.vissbleY2 = this.y2;
            }
        }
    }
}

class Wall{
    constructor(x1,y1,x2,y2){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    draw(){
        ctx.beginPath();
        ctx.moveTo(this.x1,this.y1);
        ctx.lineTo(this.x2,this.y2);
        ctx.stroke();
    }
}