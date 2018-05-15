
let CirclesArray = [];

function CreateCircles(options, container){
    
    let SVG = createSVG(container + "SVG");    

    if(document.getElementById(container) === undefined){        
        console.error("Contianer doesn't exist");
    }else{
        document.getElementById(container).appendChild(SVG);
    }

    options.forEach( opt => {    
        let circle = new CircleWidget(opt);
        circle.DrawCircle();
        circle.CreateKnob();
        circle.AddEventHandlers();
        circle.CreateDisplayField();
        circle.parentSVG = SVG;
        CirclesArray.push(circle);
        //Resize the SVG if the circle will be out of the viewbox
        if(SVG.clientWidth <= circle.radius*2.75 || SVG.clientHeight <= circle.radius*2.75){
           resizeSVG(circle);
        }
    });
}

defaultOptions = {
    name: 'circle',
    color: 'blue',
    maxVal: 100,
    minVal: 0,
    step: 1,
    container: "spinners",
    strokewidth: 30,
    smoothscroll: false,
    radius: circleRadiusSpacer(),
}



function CircleWidget(options){
    
        if(options === undefined){
            options = defaultOptions;
        }
        
        this.name   = options.name   ? options.name  : "circle";
        this.color  = options.color  ? options.color  : "blue";
        this.maxVal = options.maxVal ? options.maxVal : 100;
        this.minVal = options.minVal ? options.minVal : 0;
        this.step   = options.step   ? options.step   : 1;
        this.container = options.container ? options.container : "spinners";
        this.strokewidth = options.strokewidth ? options.strokewidth : 30;
        this.smoothscroll  = options.smoothscroll ? options.smoothscroll : false;
        this.radius = options.radius ? options.radius : circleRadiusSpacer();

        this.id = "circ" + CirclesArray.length.toString() + this.parentSVG.id; 
        this.startAngle = toRadian(-90);
        this.cx = SVG.clientWidth/2;
        this.cy = SVG.clientWidth/2;
}

CircleWidget.prototype.DrawCircle = function drawCircle() {

    this.slider = createSvgElement("circle", {
        id: this.id,
        cx: this.cx,
        cy: this.cy,
        r: this.radius,
        step: this.step,
        name: this.name,
        fill: "none",
        maxVal: this.maxVal,
        minVal: this.minVal,
        stroke: "grey",
        container: this.container,
        strokeColor: this.color,
        startAngle: this.startAngle,
        smoothscroll: this.smoothscroll,
        "stroke-opacity": 0.4,
        "stroke-width": this.strokewidth
    });

    this.parentSVG.appendChild(this.slider);

};


CircleWidget.prototype.CreateKnob = function CreateKnob() {

    let knobXY = getKnobPosition(this.startAngle, this.radius, this.cx);

    this.knob = createSvgElement("circle", {
        pID: this.id,
        cx: knobXY.knobX,
        cy: knobXY.knobY,
        r: this.strokewidth - 10,
        fill: "#EDEEEE",
        stroke: "none"
    });

    this.parentSVG.appendChild(this.knob);
}

CircleWidget.prototype.AddEventHandlers = function AddEventHandlers() {

    this.slider.addEventListener("click", move);
    this.slider.addEventListener("touchenter", move);

    this.knob.addEventListener("touchstart", start);
    this.knob.addEventListener("touchmove", move);
    this.knob.addEventListener("touchend", end);
    this.knob.addEventListener("mousedown", start);

};


CircleWidget.prototype.CreateDisplayField = function CreateDisplayField() {

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
    valBoxColor.style.float = "right";
    valBoxColor.style.marginLeft = "10px";
    valBoxValue.style.marginLeft = "10px";
    valBoxColor.style.background = this.color;

    displayCase.appendChild(valBox);

    valBox.appendChild(valBoxName);
    valBox.appendChild(valBoxValue);
    valBox.appendChild(valBoxColor);
};


CircleWidget.prototype.MoveKnob = function moveKnob(angle = this.stepAngle){
    
    let stepAngleRad = toRadian(angle+90);
    
    let knobXY = getKnobPosition(stepAngleRad, this.radius, this.cx);

    this.knob.cx.baseVal.value = knobXY.knobX;
    this.knob.cy.baseVal.value = knobXY.knobY;
    
    //moves knob to top of svg, which keeps it on top of all other elements
    this.parentSVG.appendChild(this.knob);
}

CircleWidget.prototype.GetStepAngle = function getStepAngle(angle){
     
    let numSteps = ((this.maxVal-this.minVal)/this.step);
    
    let stepAngle;

    if(this.smoothscroll){
         stepAngle = (angle/(360/numSteps) * (360/numSteps)); 
    }else{
         stepAngle = Math.round((angle/(360/numSteps))) * (360/numSteps); 
    }

    return stepAngle;

}


CircleWidget.prototype.DrawPath = function drawPath(angle = this.stepAngle){


    let path = createSvgElement("path", {  pathID : this.id,
                                fill : "none",
                                stroke : this.color,
                                "stroke-opacity" : 0.8,
                                "stroke-width":this.strokewidth,
                                d:this.GenerateArc(Math.abs(angle-180))});

    
    path.addEventListener("click", move, false);

    
    if(this.currPath !== undefined ){
        this.parentSVG.replaceChild(path, this.currPath);
        this.currPath = path;
    }else{
        this.currPath = path;
        this.parentSVG.appendChild(path);
    }
}

function getKnobPosition(angle, radius, centerSVG){
    return{
        knobX: Math.round(Math.sin(angle)*radius) + centerSVG,
        knobY: Math.round(Math.cos(angle)*radius) + centerSVG
    };
}

 function findPathXY(centerX, centerY, radius, angle) {
      let radians = toRadian(angle-180);
      return {
        x: centerX + (radius * Math.cos(radians)),
        y: centerY + (radius * Math.sin(radians))
      };
    }

CircleWidget.prototype.GenerateArc = function generateArc(endAngle){

    let radius  = this.radius;
    let centerX = this.cx;
    let centerY = this.cy;

    let start = findPathXY(centerX, centerY, radius, 0);
    let end = findPathXY(centerX, centerY, radius, endAngle);

    let largeArcFlag = endAngle <= 180 ? "0" : "1";

    return d = [
        "M", end.x, end.y, 
        "A", radius, radius, 0, largeArcFlag, 0, start.x, start.y
    ].join(" ");
}


function createSVG(svgID){
    let newSVG = createSvgElement("svg", {
                            id:svgID,
                            preserveAspectRatio: "xMidYMid slice",
                            viewBox: "1 1 1500 1500",
                            width: "100",
                            height: "100"
                          });
    
    newSVG.addEventListener("mouseup", end);
    newSVG.addEventListener("mousemove", move);
    
    return newSVG;
}


function circleRadiusSpacer(){    
    return 50 + ((CirclesArray.length)+1) * 50;
}

const toRadian = (angle) => angle * Math.PI/180;


