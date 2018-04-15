
function CreateCircle(options){
    
    let circle = new CircleWidget(options);
    circle.DrawCircle();
    circle.CreateKnob();
    circle.AddEventHandlers();
    circle.CreateDisplayField();  
    
    //Resize the SVG if the circle will be out of the viewbox
    if(container.clientWidth <= circle.radius*2.75 || container.clientHeight <= circle.radius*2.75){
       resizeSVG(circle);
    }
}


function CircleWidget(options){
    
        let defaultFlag = false;
        if(options === undefined){
            defaultFlag = true;
        }
    
        this.name   = defaultFlag ? null    : options.name
        this.color  = defaultFlag ? "blue"  : options.color;
        this.maxVal = defaultFlag ? 100     : options.maxVal;
        this.minVal = defaultFlag ? 0       : options.minVal;
        this.step   = defaultFlag ? 1       : options.step;
        this.strokewidth = defaultFlag ? 30 : options.strokewidth;
        this.smoothscroll  = defaultFlag ? false  : options.smoothscroll;
        this.radius = defaultFlag ? circleRadiusSpacer() : options.radius;
        console.log(this.radius)
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
                                                    step : this.step,
                                                    name : this.name,
                                                    fill : "none",
                                                    maxVal : this.maxVal,
                                                    minVal : this.minVal,
                                                    stroke : "grey",
                                                    strokeColor: this.color,
                                                    startAngle : this.startAngle,
                                                    smoothscroll : this.smoothscroll,
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
        
             
        container.addEventListener("mouseup", end);
        container.addEventListener("mousemove", move);
    
        this.slider.addEventListener("click", move);
        this.slider.addEventListener("touchenter", move);   
    
        this.knob.addEventListener("touchstart", start);
        this.knob.addEventListener("touchmove", move);
        this.knob.addEventListener("touchend", end);
        this.knob.addEventListener("mousedown", start);

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



 
function moveKnob(fullSlider, stepAngle){
    
    let circle = fullSlider.sCircle;
    let radius = circle.r.baseVal.value;
    let centerX = circle.cx.baseVal.value;
    
    let radian = toRadian(stepAngle);
    
    let newY = -Math.round(Math.sin(radian)*radius) + centerX;
    let newX = Math.round(Math.cos(radian)*radius)+ centerX;
    
    fullSlider.sKnob.cx.baseVal.value = newX;
    fullSlider.sKnob.cy.baseVal.value = newY;
    //moves knob to bottom of dom, which keeps it on top of all other elements
    container.appendChild(fullSlider.sKnob);
}


function getStepAngle(circle, angle){
     
    let numSteps = ((circle.attributes.maxVal.value-circle.attributes.minVal.value)/circle.attributes.step.value);
    
    let stepAngle;
    if(circle.attributes.smoothscroll.value.toLowerCase() == "true"){
         stepAngle = (angle/(360/numSteps) * (360/numSteps)); 
    }else{
         stepAngle = Math.round((angle/(360/numSteps))) * (360/numSteps); 
    }
    
    return stepAngle;
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
        circle.firstMove = true;
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
      let radians = toRadian(angle-180);
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

    let largeArcFlag = endAngle <= 180 ? "0" : "1";

    return d = [
        "M", end.x, end.y, 
        "A", radius, radius, 0, largeArcFlag, 0, start.x, start.y
    ].join(" ");
}


function circleRadiusSpacer(){    
    return 50 + ((getAllCircles().length)+1) * 50;
}

const toRadian = (angle) => angle * Math.PI/180;


