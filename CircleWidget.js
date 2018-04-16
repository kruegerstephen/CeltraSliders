
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


/*Constructor - creates circle object*/
function CircleWidget(options){
    
        let defaultFlag = false;
        if(options === undefined){
            defaultFlag = true;
        }
    
        this.name   = defaultFlag ? "circle": options.name;
        this.color  = defaultFlag ? "blue"  : options.color;
        this.maxVal = defaultFlag ? 100     : options.maxVal;
        this.minVal = defaultFlag ? 0       : options.minVal;
        this.step   = defaultFlag ? 1       : options.step;
        this.strokewidth = defaultFlag ? 30 : options.strokewidth;
        this.smoothscroll  = defaultFlag ? false  : options.smoothscroll;
        this.radius = defaultFlag ? circleRadiusSpacer() : options.radius;

        this.id = "circ" + getAllCircles().length.toString(); 
        this.startAngle = toRadian(-90);
        this.cx = container.clientWidth/2;
        this.cy = container.clientWidth/2;
}

/*Creates the circle slider SVG and appends it to the container*/
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
                                                    "stroke-opacity" : 0.4,
                                                    "stroke-width": this.strokewidth
                                                    });
       
        container.appendChild(this.slider);
     
};


/*Creates the Knob SVG and appends it to the container*/
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

/*Add event handlers for mouse and touch*/
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


/*Creates the display boxes that show circle name, value, and color of the slider*/
CircleWidget.prototype.CreateDisplayField =  function CreateDisplayField(){
       
       let valBox = document.createElement('div');
       let valBoxName = document.createElement('div');
       let valBoxValue = document.createElement('div');
       let valBoxColor = document.createElement('div');
       
       valBox.id = this.id + "display";
       valBox.style.display = "inline-flex"
       
       valBoxName.innerHTML = this.name + ":";
       
       valBoxValue.innerHTML = this.minVal;
       valBoxValue.id = this.id + "valueDisp";
       
       valBoxColor.style.height = "20px";
       valBoxColor.style.width = "20px";
       valBoxColor.style.float ="right";
       valBoxColor.style.marginLeft = "10px";
       valBoxValue.style.marginLeft = "10px";
       valBoxColor.style.background = this.color;
       
       displayCase.appendChild(valBox);
       
       valBox.appendChild(valBoxName);
       valBox.appendChild(valBoxValue);
       valBox.appendChild(valBoxColor);
};



/*takes the knobs current angle and increases it by 
the angle of one step.*/
function moveKnob(fullSlider, stepAngle){
    
    let circle = fullSlider.sCircle;
    let knob = fullSlider.sKnob;
    let radius = circle.r.baseVal.value;
    let centerX = circle.cx.baseVal.value;
    
    let radian = toRadian(stepAngle);
    
    //gets new x,y coordinates for the knob based on the stepAngle
    let newY = -Math.round(Math.sin(radian)*radius) + centerX;
    let newX = Math.round(Math.cos(radian)*radius)+ centerX;
    
    knob.cx.baseVal.value = newX;
    knob.cy.baseVal.value = newY;
    
    //moves knob to bottom of dom, which keeps it on top of all other elements
    container.appendChild(knob);
}



/*Calculates the angle of each step around the circle*/
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


/*Creates the Path based on knob position in the circle 
  and appends it to the SVG. 
  Will replace the current path if there is one*/
function drawPath(fullSlider, angle){
         
     let circle = fullSlider.sCircle;  
     let strokewidth = circle.attributes["stroke-width"].value;
     let currPath = getAllPaths().filter(child => child.attributes.pathID.value == circle.id)[0]; 

     let path = createSvgElement("path", {  pathID : circle.id,
                                fill : "none",
                                stroke : circle.attributes.strokeColor.value,
                                "stroke-opacity" : 0.8,
                                "stroke-width":strokewidth,
                                d:generateArc(circle, Math.abs(angle-180))});

    
    path.addEventListener("click", move, false);

    
    if(currPath !== undefined ){
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
    };
    
}

 function findPathXY(centerX, centerY, radius, angle) {
      let radians = toRadian(angle-180);
      return {
        x: centerX + (radius * Math.cos(radians)),
        y: centerY + (radius * Math.sin(radians))
      };
    }

/*Generates the 'arc' of the path. In Svg it is the 'A' part of the whole path;*/
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


/*auto calculates radius of default circles*/
function circleRadiusSpacer(){    
    return 50 + ((getAllCircles().length)+1) * 50;
}

const toRadian = (angle) => angle * Math.PI/180;


