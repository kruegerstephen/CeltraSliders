//instructions: 
//when creating new instance of the slider, pass in the options object
//multiple sliders can be rendered in the same container (see image below)
//each slider should have his own max/min limit and step value
//value number (on the left in the image) should change in real time based on the slider’s position
//make sure touch events on one slider don’t affect others (even if finger goes out of touched slider range)
//slider value should change when you drag the handle or if you tap the spot on a slider

document.addEventListener('DOMContentLoaded', function(){ 

    let container = document.getElementById('container');
    const circles = [];
    const knobs = [];
    const containerCenterW =  container.clientWidth/2;
    const containerCenterH =  container.clientHeight/2;
    let containerSize = container.clientWidth;
    let startAngle = 180*Math.PI/180;
    let allowMove = false;
    
//define circles
circles.push({
    id : "circ1",
    container: "",
    color: "green",
    strokewidth:5,
    maxVal: "",
    minVal: "",
    step: 90,
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


/*----------------originial circle drawing ----------*/
function drawCircle(circle, angle){
    
    let r = getNode('circle', { id : circle.id,
                                cx : circle.x,
                                cy : circle.y,
                                r  : circle.radius,
                                fill : "none",
                                stroke : circle.color,
                                'stroke-width': circle.strokewidth
                                });
    
    let x = getNode('circle', { id : "circle1Spinner",
                                pID : circle.id,
                                cx : Math.round(Math.sin(angle)*circle.radius) + containerSize/2,
                                cy : Math.round(Math.cos(angle)*circle.radius)+ containerSize/2,
                                r : circle.radius/10,
                                fill : "red",
                                stroke : "none"});
    knobs.push(x);
    container.appendChild(r);
    container.appendChild(x);
    
}
    
function getNode(n, v) {
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (var p in v)
    n.setAttributeNS(null, p, v[p]);
  return n
}
/*----------------end circle drawing ----------*/

    

/* ---------event handlers------------ */
let knob1 = document.getElementById("circle1Spinner");
let circ1 = document.getElementById("circ1");
let moveThisKnob;
knob1.addEventListener('touchstart', start , false);
knob1.addEventListener('touchmove', move , false);
knob1.addEventListener('mousedown', start , false);
container.addEventListener('mouseup', end , false);
container.addEventListener('mousemove', move , false);
    
function moveKnob(angle){
    let circ = circles.filter(c => c.id == moveThisKnob.getAttribute('pID'))[0];   
    angle = Math.round(angle/circ.step) * circ.step;
    let radian = angle*Math.PI/180;
    let top = -Math.round(Math.sin(radian)*circ.radius) + containerSize/2;
    let left = Math.round(Math.cos(radian)*circ.radius)+ containerSize/2;
    moveThisKnob.cx.baseVal.value = left;
    moveThisKnob.cy.baseVal.value = top;
}    
    
function start(e){
  moveThisKnob = this;
  allowMove = true;
}
    
    
function move(e){ 
  if(allowMove){
    let y = this.parentElement.clientWidth/2- e.pageY;
    let x = e.pageX - this.parentElement.clientWidth/2;
    
    let radian = Math.atan2(y, x);
    let angle = radian*180/Math.PI;
    console.log(angle)
    angle = Math.round(angle/30) * 30;
    moveKnob(angle);
  }
}    
    
function end(e){
  allowMove = false;
}
/*-------------end event handlers ----------------*/
    
}, false);