
function CreateCircle(options){
    
    let circle = new CircleWidget(options);
    circle.DrawCircle();
    circle.CreateKnob();
    circle.AddEventHandlers();
    circle.CreateDisplayField();  
    
    //Resize the SVG if the circle will be out of the viewbox
    if(container.clientWidth < circle.radius*2.5 || container.clientHeight< circle.radius*2.5){
       resizeSVG(circle);
    }
}


function CircleWidget(options){
    
        let defaultFlag = false;
        if(options === undefined){
            defaultFlag = true;
        }
    
        this.color  = defaultFlag ? "blue"  : options.color;
        this.maxVal = defaultFlag ? 100     : options.maxVal;
        this.minVal = defaultFlag ? 0       : options.minVal;
        this.step   = defaultFlag ? 1       : options.step;
        this.strokewidth = defaultFlag ? 30 : options.strokewidth;
        this.radius = defaultFlag ? circleRadiusSpacer() : options.radius;

        this.id = "circ" + getAllCircles().length.toString(); 
        this.startAngle = -90*Math.PI/180;
        this.cx = container.clientWidth/2;
        this.cy = container.clientWidth/2;

}

CircleWidget.prototype.DrawCircle = function drawCircle(){


       this.slider = createSvgElement("circle", {   id : this.id,
                                                    cx : this.cx,
                                                    cy : this.cy,
                                                    r  : this.radius,
                                                    strokeColor: this.color,
                                                    maxVal : this.maxVal,
                                                    minVal : this.minVal,
                                                    step : this.step,
                                                    fill : "none",
                                                    stroke : "grey",
                                                    startAngle : this.startAngle,
                                                    "stroke-opacity" : .4,
                                                    "stroke-width": this.strokewidth
                                                    });
       
        container.appendChild(this.slider);
     
};

CircleWidget.prototype.CreateKnob = function CreateKnob(){
    
    let knobXY = getKnobPosition(this.startAngle, this.radius, this.cx);
    
    this.knob = createSvgElement("circle", {   pID  : this.id,
                                               cx   : knobXY.knobX,
                                               cy   : knobXY.knobY,
                                               r    : this.strokewidth-10,
                                               fill : "#EDEEEE",
                                               stroke : "none"});
    
    container.appendChild(this.knob);
}

CircleWidget.prototype.AddEventHandlers =  function AddEventHandlers(){
        
             
        container.addEventListener("mouseup", end , false);
        container.addEventListener("mousemove", move, false);
    
        this.slider.addEventListener("click", move, false);
        this.slider.addEventListener("touchenter", move, false);   
    
        this.knob.addEventListener("touchstart", start , false);
        this.knob.addEventListener("touchmove", move , false);
        this.knob.addEventListener("touchend", end , false);
        this.knob.addEventListener("mousedown", start , false);

};

CircleWidget.prototype.CreateDisplayField =  function CreateDisplayField(){
       //var body = document.getElementsByTagName("body")[0];
       //let displayCase = document.createElement('div');
       //displayCase.id = "displayCase";
       //body.appendChild(displayCase);
       let valueDisplay = document.createElement('div');
       valueDisplay.id = this.id + "display";
       displayCase.appendChild(valueDisplay);
       
};



 
function moveKnob(fullSlider, angle){
    
    let circle = fullSlider.sCircle;
    let step = (circle.attributes.maxVal.value-circle.attributes.minVal.value)/circle.attributes.step.value;
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
         
     let currPath = getAllPaths().filter(child => child.attributes.pathID.value == fullSlider.sCircle.id)[0]; 
     let circle = fullSlider.sCircle;  
    
     let strokewidth = circle.attributes["stroke-width"].value;

     let path = createSvgElement("path", {  pathID : circle.id,
                                fill : "none",
                                stroke : circle.attributes.strokeColor.value,
                                "stroke-opacity" : .8,
                                "stroke-width":strokewidth,
                                d:generateArc(circle, Math.abs(angle-180))});

    
    path.addEventListener("click", move, false);

    
    if(currPath != undefined ){
        container.replaceChild(path, currPath);
    }else{
        container.appendChild(path);
    }
}

function getKnobPosition(angle, radius, centerContainer){
    return{
        knobX: Math.round(Math.sin(angle)*radius) + centerContainer,
        knobY: Math.round(Math.cos(angle)*radius)+ centerContainer
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


function circleRadiusSpacer(){    
    return 50 + getAllCircles().length * 50;
}


