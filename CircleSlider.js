//instructions: 
//when creating new instance of the slider, pass in the options object
//multiple sliders can be rendered in the same container (see image below)
//each slider should have his own max/min limit and step value
//value number (on the left in the image) should change in real time based on the slider’s position
//make sure touch events on one slider don’t affect others (even if finger goes out of touched slider range)
//slider value should change when you drag the handle or if you tap the spot on a slider

document.addEventListener('DOMContentLoaded', function(){ 

    var container = document.getElementById('container');
    const circles = [];
    var radius = 100;
    const containerCenterW =  container.clientWidth/2;
    const containerCenterH =  container.clientHeight/2;

    var containerSize = container.clientWidth;

    var startAngle = 180*Math.PI/180;

    let allowMove = true;
    
circles.push({
    id : "circ1",
    container: "",
    color: "blue",
    strokewidth:5,
    maxVal: "",
    minVal: "",
    step: "",
    x: 150,
    y: 150,
    radius: 100,
    strokewidth: 25
})

    
circles.forEach(
    function(circle)
    {
        drawCircle(circle, startAngle);
    }
);



function drawCircle(circle, angle){
    
    var r = getNode('circle', { id : circle.id,
                                cx : circle.x,
                                cy : circle.y,
                                r  : circle.radius,
                                fill : "none",
                                stroke : circle.color,
                                'stroke-width': circle.strokewidth
                                });
    
    var x = getNode('circle', { id : "circle1Spinner",
                                parentId : circle.id,
                                cx : Math.round(Math.sin(angle)*radius) + containerSize/2,
                                cy : Math.round(Math.cos(angle)*radius)+ containerSize/2,
                                r : circle.radius/10,
                                fill : "red",
                                stroke : "none"});
    container.appendChild(r);
    container.appendChild(x);
    
}
    
    
function degreesTostartAngles(degrees){
   let rads = (degrees * Math.PI/180);
    return rads;
}

function getNode(n, v) {
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (var p in v)
    n.setAttributeNS(null, p, v[p]);
  return n
}
    

var circ1 = document.getElementById("circle1Spinner");
circ1.addEventListener('touchstart', start , false);
circ1.addEventListener('touchmove', move , false);
circ1.addEventListener('mousedown', start , false);
circ1.addEventListener('mouseup', end , false);
circ1.addEventListener('mousemove', move , false);


function start(e){
  allowMove = true;
}

function move(e){ 
  if(allowMove){
    var y = this.parentElement.clientWidth/2- e.pageY;
    var x = e.pageX - this.parentElement.clientWidth/2;
    
    var radian = Math.atan2(y, x);
    var angle = radian*180/Math.PI;
    var currentCirc = circles.filter(circ => circ.id == this.getAttribute('parentId'));
    drawCircle(currentCirc[0], angle);
  }
}    
    
function end(e){
  allowMove = true;
}
    
    
}, false);