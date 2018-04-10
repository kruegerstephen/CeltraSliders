//instructions: 
//when creating new instance of the slider, pass in the options object
//multiple sliders can be rendered in the same container (see image below)
//each slider should have his own max/min limit and step value
//value number (on the left in the image) should change in real time based on the slider’s position
//make sure touch events on one slider don’t affect others (even if finger goes out of touched slider range)
//slider value should change when you drag the handle or if you tap the spot on a slider

document.addEventListener('DOMContentLoaded', function(){ 

    var container = document.getElementById('container');
    var circles = [];
    var radius = 100;
    var containerCenterW = container.offsetLeft + container.clientWidth/2;
    var containerCenterH = container.offsetTop + container.clientHeight/2;

    var containerSize = container.clientWidth;

    var radian = 49*Math.PI/180;

    
    
circles.push({
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
        drawCircle(circle);
    }
);



function drawCircle(circle){
    
    var r = getNode('circle', { id : "circle1",
                                cx : circle.x,
                                cy : circle.y,
                                r  : circle.radius,
                                fill : "none",
                                stroke : circle.color,
                                'stroke-width': circle.strokewidth
                                });
    
    var x = getNode('circle', { id : "circle1Spinner",
                                cx : Math.round(Math.sin(radian)*radius) + containerSize/2,
                                cy : Math.round(Math.cos(radian)*radius)+ containerSize/2,
                                r : circle.radius/10,
                                fill : "red",
                                stroke : "none"});
    container.appendChild(r);
    container.appendChild(x);
    
}
    
    
function degreesToRadians(degrees){
   let rads = (degrees * Math.PI/180);
    return rads;
}

function getNode(n, v) {
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (var p in v)
    n.setAttributeNS(null, p, v[p]);
  return n
}
    

    
    
}, false);