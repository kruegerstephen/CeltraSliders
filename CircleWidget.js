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
    
        let r = getNode("circle", { id : this.id,
                                    cx : this.x,
                                    cy : this.y,
                                    r  : this.radius,
                                    strokeColor: this.color,
                                    maxVal : this.maxVal,
                                    minVal : this.minVal,
                                    step : this.step,
                                    fill : "none",
                                    stroke : "grey",
                                    "stroke-width": this.strokewidth
                                    });

        let x = getNode("circle", { pID : this.id,
                                    cx : Math.round(Math.sin(startAngle)*this.radius) + this.x,
                                    cy : Math.round(Math.cos(startAngle)*this.radius)+ this.x,
                                    r : this.radius/7,
                                    fill : "silver",
                                    stroke : "none"});
        knobs.push(x);
        container.appendChild(r);
        container.appendChild(x);
        this.container = container;
        this.svgElem = r;

};



CircleWidget.prototype.AddEventHandlers =  function AddEventHandlers(){
        let knob = knobs.filter(kn => kn.getAttribute("pID") == this.id)[0];
        knob.addEventListener("touchstart", start , false);
        knob.addEventListener("touchmove", move , false);
        knob.addEventListener("mousedown", start , false);
        this.container.addEventListener("mouseup", end , true);
        this.container.addEventListener("mousemove", move, true);
        this.svgElem.addEventListener("click", move, false);
};

CircleWidget.prototype.CreateDisplayField =  function CreateDisplayField(){
       let displayCase = document.getElementById('displayCase');
       let valueDisplay = document.createElement('div');
       valueDisplay.id = this.id + "display";
       displayCase.appendChild(valueDisplay);
       
};



 
function moveKnob(fullSlider, angle){
    
    let circle = fullSlider.sCircle;
    let step = circle.attributes.maxVal.value/circle.attributes.step.value;
    let radius = circle.r.baseVal.value;
    let centerX = circle.cx.baseVal.value;
    
    let stepAngle = Math.round(angle/(360/step)) * (360/step);    
    let radian = stepAngle*Math.PI/180;
    
    let newY = -Math.round(Math.sin(radian)*radius) + centerX;
    let newX = Math.round(Math.cos(radian)*radius)+ centerX;
    
    fullSlider.sKnob.cx.baseVal.value = newX;
    fullSlider.sKnob.cy.baseVal.value = newY;

    drawPath(fullSlider, stepAngle);
    valueConversion(fullSlider, stepAngle);
    
    //moves knob to bottom of dom, which keeps it on top of all other elements
    container.appendChild(fullSlider.sKnob);
}


function drawPath(fullSlider, angle){
         
     let circPath = getAllPaths().filter(child => child.attributes.pathID.value == fullSlider.sCircle.id)[0]; 
     let circle = fullSlider.sCircle; 
    
    
    
     let strokewidth = circle.attributes["stroke-width"].value;

     let x = getNode("path", {  pathID : circle.id,
                                fill : "none",
                                stroke : circle.attributes.strokeColor.value,
                                "stroke-width":strokewidth,
                                d:generateArc(circle, Math.abs(angle-180))});

    
    x.addEventListener("click", move, false);

    
    if(circPath != undefined ){
        container.replaceChild(x,circPath);
    }else{
        container.appendChild(x);
    }
}

 function findPathXY(centerX, centerY, radius, angle) {
      let radians = (angle-180) * Math.PI / 180.0;

      return {
        x: centerX + (radius * Math.cos(radians)),
        y: centerY + (radius * Math.sin(radians))
      };
    }

function generateArc(circle, endAngle){

    let radius = circle.r.baseVal.value;
    let centerX = circle.cx.baseVal.value;
    let centerY = circle.cx.baseVal.value;

    let start = findPathXY(centerX, centerY, radius, 0);
    let end = findPathXY(centerX, centerY, radius, endAngle);

    let largeArcFlag = endAngle - 0 <= 180 ? "0" : "1";

    return d = [
        "M", end.x, end.y, 
        "A", radius, radius, 0, largeArcFlag, 0, start.x, start.y
    ].join(" ");

     
}


