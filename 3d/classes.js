class Player{
    moveSpeed = 5;
    rotation = 0;
    rotationSpeed = 0.1;
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    move(){
        this.rotation += (keyPressed.d - keyPressed.a) * this.rotationSpeed;
        if(controlType2D){
            this.x += (keyPressed.right - keyPressed.left) * this.moveSpeed;
            this.y += (keyPressed.down - keyPressed.up) * this.moveSpeed;
        }
        else{
            this.x += (keyPressed.right - keyPressed.left) * this.moveSpeed * Math.sin(-this.rotation) - (keyPressed.down - keyPressed.up) * this.moveSpeed * Math.cos(-this.rotation);
            this.y += (keyPressed.right - keyPressed.left) * this.moveSpeed * Math.cos(-this.rotation) + (keyPressed.down - keyPressed.up) * this.moveSpeed * Math.sin(-this.rotation);
        }
    }

    draw(){
        ctx2d.beginPath();
        ctx2d.arc(this.x, this.y,8, 0, 2 * Math.PI);
        ctx2d.fill();
    }
    drawRays(){
        for(let i = 0-rayCount*0.5; i < rayCount; i++){
            var ray = new Ray(this.x, this.y, this.rotation + i*(fov*2*Math.PI/360)/rayCount);
            var collistion = ray.checkCollistion();
            ray.draw();
            draw3D(this.x,this.y,collistion[0],collistion[1],i+rayCount*0.5)
        }
    }
}

class Ray{
    constructor(x,y,ang){
        this.x1 = x;
        this.y1 = y;

        this.x2 = x + Math.cos(ang)*viewDistance;
        this.y2 = y + Math.sin(ang)*viewDistance;

        this.vissbleX2 = this.x2;
        this.vissbleY2 = this.y2;
    }
    draw(){
        ctx2d.beginPath();
        ctx2d.moveTo(this.x1,this.y1);
        ctx2d.lineTo(this.vissbleX2,this.vissbleY2);
        ctx2d.stroke();
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
        return([this.vissbleX2,this.vissbleY2])
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
        ctx2d.beginPath();
        ctx2d.moveTo(this.x1,this.y1);
        ctx2d.lineTo(this.x2,this.y2);
        ctx2d.stroke();
    }
}