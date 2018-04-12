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
    let startAngle = -90*Math.PI/180;
    let allowMove = false;
    let moveThisKnob;

    //define circles
    circles.push({
        id : "circ1",
        color: "blue",
        maxVal: 100,
        minVal: 0,
        step: 20,
        x: containerCenterW,
        y: containerCenterH,
        radius: 100,
        strokewidth: 25
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
                                    stroke : "grey",
                                    'stroke-width': circle.strokewidth
                                    });

        let x = getNode('circle', { pID : circle.id,
                                    cx : Math.round(Math.sin(angle)*circle.radius) + containerSize/2,
                                    cy : Math.round(Math.cos(angle)*circle.radius)+ containerSize/2,
                                    r : circle.radius/10,
                                    fill : "red",
                                    stroke : "none"});
        knobs.push(x);
        container.appendChild(r);
        container.appendChild(x);

    }

    /*----------------end circle drawing ----------*/


    
    
    function findXY(centerX, centerY, radius, angle) {
      var radians = (angle-180) * Math.PI / 180.0;

      return {
        x: centerX + (radius * Math.cos(radians)),
        y: centerY + (radius * Math.sin(radians))
      };
    }

    function generateArc(circle, endAngle){

        var end = findXY(circle.x, circle.y, circle.radius, endAngle);
        var start = findXY(circle.x, circle.y, circle.radius, 0);

        var largeArcFlag = endAngle - 0 <= 180 ? "0" : "1";

        var d = [
            "M", end.x, end.y, 
            "A", circle.radius, circle.radius, 0, largeArcFlag, 0, start.x, start.y
        ].join(" ");

        return d;       
    }

    function drawPath(circle, angle){
         
        childArray = Array.from(container.children);
        circPath = childArray.filter(cNode => cNode.nodeName === 'path');
        circPath = circPath.filter(path => path.getAttribute('pathID') === circle.id)[0];
        
         let x = getNode('path', {  pathID : circle.id,
                                    fill : "none",
                                    stroke : circle.color,
                                    'stroke-width':circle.strokewidth,
                                    d:generateArc(circle, Math.abs(angle-180))});
        
        if(circPath!= undefined ){
           container.replaceChild(x,circPath);
        }else{
            container.appendChild(x);
        }
        
    }
    
    
    function getNode(n, v) {
      n = document.createElementNS("http://www.w3.org/2000/svg", n);
      for (var p in v)
        n.setAttributeNS(null, p, v[p]);
      return n
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
        let stepAngle = Math.round(angle/(360/circ.step)) * (360/circ.step);
        valueConversion(circ, stepAngle);
        let radian = stepAngle*Math.PI/180;
        let top = -Math.round(Math.sin(radian)*circ.radius) + containerSize/2;
        let left = Math.round(Math.cos(radian)*circ.radius)+ containerSize/2;
        moveThisKnob.cx.baseVal.value = left;
        moveThisKnob.cy.baseVal.value = top;
        drawPath(circ, stepAngle);
    }    

    function start(e){
      moveThisKnob = this;
      allowMove = true;
    }


    function move(e){ 
      if(allowMove){
          let y,x;
          
          if(e.type != "touchmove")
          {
             y = containerCenterW- e.pageY;
             x = e.pageX - containerCenterW;
          }else{
             y = containerCenterW- e.touches[0].pageY;
             x = e.touches[0].pageX - containerCenterW;
          }
          
        let radian = Math.atan2(y, x);
        let angle = radian*180/Math.PI;
        console.log(angle+180)
        moveKnob(angle);
        
      }
    }    

    function end(e){
      allowMove = false;
    }

/*-------------end event handlers ----------------*/
    
}, false);
