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
    let startAngle = 270*Math.PI/180;
    let allowMove = false;
    let moveThisKnob;

    //define circles
    circles.push({
        id : "circ1",
        color: "green",
        maxVal: 100,
        minVal: 0,
        step: 20,
        x: 150,
        y: 150,
        radius: 100,
        strokewidth: 2
    })


    circles.forEach(
        function(circle)
        {
            drawCircle(circle, startAngle);
            AddEventHandlers(circle);
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


    function valueConversion(circ, angle){

        let value = ((angle-180)/360) * circ.maxVal;
        console.log(Math.abs(value/circ.step)*circ.step);

    }

    /* ---------event handlers------------ */    
    function AddEventHandlers(circle){
        let knob1 = knobs.filter(kn => kn.getAttribute('pID') == circle.id)[0];
        knob1.addEventListener('touchstart', start , false);
        knob1.addEventListener('touchmove', move , false);
        knob1.addEventListener('mousedown', start , false);
    }

    
    container.addEventListener('mouseup', end , false);
    container.addEventListener('mousemove', move , false);
    
    function moveKnob(angle){
        let circ = circles.filter(c => c.id == moveThisKnob.getAttribute('pID'))[0];   
        angle = Math.round(angle/(360/circ.step)) * (360/circ.step);
        valueConversion(circ, angle);
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
        let y = container.clientWidth/2- e.pageY;
        let x = e.pageX - container.clientWidth/2;

        let radian = Math.atan2(y, x);
        let angle = radian*180/Math.PI;
        moveKnob(angle);
      }
    }    

    function end(e){
      allowMove = false;
    }

/*-------------end event handlers ----------------*/
    
}, false);