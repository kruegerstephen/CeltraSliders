//instructions: 
//when creating new instance of the slider, pass in the options object
//multiple sliders can be rendered in the same container (see image below)
//each slider should have his own max/min limit and step value
//value number (on the left in the image) should change in real time based on the slider’s position
//make sure touch events on one slider don’t affect others (even if finger goes out of touched slider range)
//slider value should change when you drag the handle or if you tap the spot on a slider

document.addEventListener('DOMContentLoaded', function(){ 

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let circleX = 150;
let circleY = 150;


let options = {
    container: "",
    color: "",
    maxVal: "",
    minVal: "",
    step: "",
    radius: 90,
}

let degreesToRadians = function(degrees){
   let rads = (degrees * Math.PI/180);
    return rads;
}

let drawCircle = function drawCircle(options){
    
    let startAng = degreesToRadians(0);
    let endAng = degreesToRadians(360);
    
    context.clearRect(0, 0, canvas.width, canvas.height);

    //draw circle
    context.beginPath();
    context.arc(circleX, circleY, options.radius, startAng, endAng);
    context.stroke();
    
    //draw indicator
    context.beginPath();
    context.arc(circleX, circleY, options.radius, startAng, endAng/20);
    context.strokeStyle = "blue";
    context.lineWidth = 5;
    context.stroke();
}



drawCircle(options);

    
    
}, false);