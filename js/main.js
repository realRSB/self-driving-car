// pasue and resume button for convenience
let paused = false;
function pause() {
    paused = !paused;
    if (!paused) requestAnimationFrame(animate);
}


// carCanvas
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const carCtx = carCanvas.getContext("2d");

// networkCanvas
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;
const networkCtx = networkCanvas.getContext("2d");


// to draw on canvas
const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
// const car=new Car(road.getLaneCenter(1),100,30,50, "AI"); can change AI to KEYS

const N = 1000; // change for nuumber of cars
const cars=generateCars(N);
let bestCar=cars[0];

// if best brain exists update car to have it's brain
if(localStorage.getItem("bestBrain")){
        for(let i=0; i<cars.length; i++) {
            cars[i].brain=JSON.parse(
                localStorage.getItem("bestBrain"));
            if(i!=0){
                NeuralNetwork.mutate(cars[i].brain,0.2)
            }
        }
};


const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(0),-300,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(2),-300,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(1),-500,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(2),-500,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(2),-700,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(0),-700,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(2),-100,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(2),-100,30,50, "DUMMY", 2)
];

animate();

// saving the best brain in local storage
function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)
    )
}

// discarding the best brain in local storage
function discard() {
    localStorage.clear("bestBrain");
}

function reload() {
    location.reload()
}

function generateCars(N) {
    const cars=[];
    for(let i=0; i<N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    return cars
}


function animate(time) {
    if (paused) return;
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, []);
    }
    
    for(let i=0; i<cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }
    
    bestCar=cars.find(
    // this finds the car that has the LOWEST y val (remember y val in screen is lower as you go higher on the screen)
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    )

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0; i<traffic.length; i++) {
        traffic[i].draw(carCtx, "red");
    }
    
    carCtx.globalAlpha=0.2; // adjusts transparency of cars
    for(let i=0; i<cars.length; i++) {
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx, "blue", true)

    //requestAnimationFrame calls animate method many times per second giving illusion of movement
    carCtx.restore()

    // visualize lines
    networkCtx.lineDashOffset=-time/50

    // visualizing the neural network

    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}