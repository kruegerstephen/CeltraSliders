const knobs = [];


function CircleWidget(options){
        this.id = options.id,
        this.color = options.color,
        this.maxVal= options.maxVal,
        this.minVal= options.minVal,
        this.step= options.step,
        this.x = options.x,
        this.y = options.y,
        this.radius= options.radius,
        this.strokewidth= 25;
}

CircleWidget.prototype.DrawCircle = function drawCircle(){

        let startAngle = -90*Math.PI/180;
    
        let r = getNode('circle', { id : this.id,
                                    cx : this.x,
                                    cy : this.y,
                                    r  : this.radius,
                                    maxVal : this.maxVal,
                                    minVal : this.minVal,
                                    step : this.step,
                                    fill : "none",
                                    stroke : "grey",
                                    'stroke-width': this.strokewidth
                                    });

        let x = getNode('circle', { pID : this.id,
                                    cx : Math.round(Math.sin(startAngle)*this.radius) + this.x,
                                    cy : Math.round(Math.cos(startAngle)*this.radius)+ this.x,
                                    r : this.radius/10,
                                    fill : "red",
                                    stroke : "none"});
        knobs.push(x);
        container.appendChild(r);
        container.appendChild(x);
        this.container = container;
        this.svgElem = r;

}

CircleWidget.prototype.AddEventHandlers =  function AddEventHandlers(){
        let knob1 = knobs.filter(kn => kn.getAttribute('pID') == this.id)[0];
        knob1.addEventListener('touchstart', start , false);
        knob1.addEventListener('touchmove', move , false);
        knob1.addEventListener('mousedown', start , false);
        this.container.addEventListener('mouseup', end , true);
        this.container.addEventListener('mousemove', move, true);
    }


 
function moveKnob(circ, angle){
    
    let step = circ.attributes['step'].value;
    let radius = circ.r.baseVal.value;
    let centerX = circ.cx.baseVal.value;
    
    let stepAngle = Math.round(angle/(360/step)) * (360/step);
    let radian = stepAngle*Math.PI/180;
    let top = -Math.round(Math.sin(radian)*radius) + centerX;
    let left = Math.round(Math.cos(radian)*radius)+ centerX;
    moveThisKnob.cx.baseVal.value = left;
    moveThisKnob.cy.baseVal.value = top;

    drawPath(circ, stepAngle);
    valueConversion(circ, stepAngle);
}


function drawPath(circle, angle){
         
    childArray = Array.from(container.children);
    circPath = childArray.filter(cNode => cNode.nodeName === 'path');
    circPath = circPath.filter(path => path.getAttribute('pathID') === circle.id)[0];

     let strokewidth = circle.attributes['stroke-width'].value;

     let x = getNode('path', {  pathID : circle.id,
                                fill : "none",
                                stroke : "black",
                                'stroke-width':strokewidth,
                                d:generateArc(circle, Math.abs(angle-180))});

    if(circPath!= undefined ){
       container.replaceChild(x,circPath);
    }else{
        container.appendChild(x);
    }

}

 function findPathXY(centerX, centerY, radius, angle) {
      var radians = (angle-180) * Math.PI / 180.0;

      return {
        x: centerX + (radius * Math.cos(radians)),
        y: centerY + (radius * Math.sin(radians))
      };
    }

function generateArc(circle, endAngle){

    let radius = circle.r.baseVal.value;
    let centerX = circle.cx.baseVal.value;
    let centerY = circle.cx.baseVal.value;


    var start = findPathXY(centerX, centerY, radius, 0);
    var end = findPathXY(centerX, centerY, radius, endAngle);

    var largeArcFlag = endAngle - 0 <= 180 ? "0" : "1";

    var d = [
        "M", end.x, end.y, 
        "A", radius, radius, 0, largeArcFlag, 0, start.x, start.y
    ].join(" ");

    return d;       
}





function getNode(n, v) {
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (var p in v)
    n.setAttributeNS(null, p, v[p]);
  return n
}
