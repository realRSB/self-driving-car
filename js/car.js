class Car{
    constructor(x,y,width,height,controlType,maxSpeed=3){
    // car properties
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        this.angle=0;
        this.damaged=false;

        this.useBrain=controlType=="AI"

        if(controlType!="DUMMY"){
            this.sensor=new Sensor(this);
            this.brain=new NeuralNetwork(
                // first layer is raycount, 6 is hidden layer, 4 is output (forward, left, right, reverse)
                [this.sensor.rayCount,6,4]
            )
        }
        this.controls=new Controls(controlType);
    }

    update(roadBorders,traffic){
        if(!this.damaged){
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders,traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBorders,traffic);
            const offsets = this.sensor.readings.map(
                // if null return 0 (no reading), else return sensor offset
                s=>s==null?0:1-s.offset
            );
            const outputs=NeuralNetwork.feedForward(offsets, this.brain)

            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.reverse=outputs[3];
            }
        }
    }

    #assessDamage(roadBorders,traffic){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }
    
    // private method 
    #move() {
        // on computer y increases downwards
        if(this.controls.forward) {
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse) {
            this.speed-=this.acceleration;
        }
        if(this.speed>this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        // negative speed just to indicate car is going backwards
        if(this.speed<-this.maxSpeed/2) {
            this.speed=-this.maxSpeed/2;
        }
        if(this.speed>0) {
            this.speed-=this.friction;
        }
        if(this.speed<0) {
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }
        if(this.speed!=0) {
            // value of flip is 1 or -1 depending on speed
            const flip=this.speed>0?1: -1;
            if(this.controls.left) {
                this.angle+=0.03*flip;
            }
            if(this.controls.right) {
                this.angle-=0.03*flip;
            }
        }
    
        // translation according to unit circle
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    // x is the center of the car
    draw (ctx, color, drawSensor=false) {
        if (this.damaged){
            ctx.fillStyle='gray';
        } else {
            ctx.fillStyle=color;
        }

        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i=0; i<this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

        if(this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }
    }
}