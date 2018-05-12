let SVG;
let CirclesArray = [];

function CreateCircle(options, container){
    
    SVG = createSVG(container + "SVG");    

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
    
        let defaultFlag = false;
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

        this.id = "circ" + CirclesArray.length.toString() + SVG.id; 
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

    SVG.appendChild(this.slider);

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

    SVG.appendChild(this.knob);
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
    this.knob.cy.baseVal.value  = knobXY.knobY;
    
    //moves knob to top of svg, which keeps it on top of all other elements
    SVG.appendChild(this.knob);
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
        SVG.replaceChild(path, this.currPath);
        this.currPath = path;
    }else{
        this.currPath = path;
        SVG.appendChild(path);
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

CircleWidget.prototype.SetValue = function valueConversion(angle){
    
    let maxAngle = -179;
    let stepVal = this.maxVal-this.minVal;

    let value = ((this.stepAngle+180)/360) * stepVal;
    value = Math.abs((stepVal)-Math.floor(value/this.step)*this.step);
    let floorVal = stepVal- Math.abs((stepVal)-Math.floor(value/this.step)*this.step);

    /*handling value edge cases for stepping*/
    if(maxAngle+4 >= angle && angle >= maxAngle && value<=stepVal){
            value = this.maxVal;
            this.MoveKnob(maxAngle);
            this.DrawPath(maxAngle);
    }else if(value + this.minVal == this.step && this.minVal < this.step){
           value = this.minVal;
    }else if(value + this.minVal == this.maxVal && 0 === (this.stepAngle+180)/360){
           value = this.maxVal;
           this.MoveKnob(maxAngle);
           this.DrawPath(maxAngle);
    }
    else{
        if(value < this.step){
            value = this.minVal;
        }else{
             value = this.minVal + floorVal;
        }
    }
    
    this.DisplayValue(value);
}

CircleWidget.prototype.DisplayValue = function displayValue(value){
    let circleDisplayID = this.id + "valueDisp";
    let dispDIV = document.getElementById(circleDisplayID);
    dispDIV.innerHTML = value;
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

let allowMove = false;

function start(e){
  moveThisKnob = this;
  allowMove = true;
}

function end(e){
    allowMove = false;  
}

function move(e){
    e.preventDefault();
          if(allowMove || e.type === "click")
          {                       
              
            if(e.type==="click"){ allowMove = false };
                              
            let Circle = getCircle(this, e.type);
            let offset = getEventXYCoord(e);
            let radian = Math.atan2(offset.y, offset.x);
            let angle = radian*180/Math.PI;
            
            Circle.stepAngle = Circle.GetStepAngle(angle);

            Circle.DrawPath();
            Circle.MoveKnob();
            Circle.SetValue(angle);
          }
        
 }

function getCircle(clickedElement, eventType){
    
    if(eventType != "click"){
        if(moveThisKnob != undefined){
            return CirclesArray.find(circ => circ.id === moveThisKnob.attributes.pID.value);     
        }
    }else if(clickedElement.nodeName === "path"){ 
        return CirclesArray.find(circ => circ.id === clickedElement.attributes.pathID.value);     
    }else if (clickedElement.nodeName === "circle"){
        return CirclesArray.find(circ => circ.id === clickedElement.id);     
    }
}


function getEventXYCoord(e){
    
    let globalPointsFlag = false;
    let containerCenterW;
    
    /*hack for firefox - expensive call so will only use when necessary*/
    if(SVG.clientWidth === 0){
        globalPointsFlag = true;
        var globalPoint = getGlobalPoint(e);
        containerWidth = SVG.attributes.width.value/2;
    }else{
        containerCenterW = SVG.clientWidth/2;
    }

    /*essentially: if (firefox) else if(other browsers) else if (mobile)*/
    if((e.type === "mousemove" || e.type ==="click") && globalPointsFlag)
      {
         return {
             y : containerWidth - globalPoint.y,
             x : globalPoint.x - containerWidth, 
         }

      }else if((e.type === "click" || e.type ==="mousemove") && !globalPointsFlag){
          return{
              y : containerCenterW- e.offsetY,
              x : e.offsetX - containerCenterW,
          } 
      }
      else if(e.type === "touchmove"){
          /*calculates offset of SVG for correct touch angles*/
        return{
            y : SVG.getBoundingClientRect().top + document.documentElement.scrollTop + containerCenterW - e.touches[0].pageY,
            x : e.touches[0].pageX - SVG.getBoundingClientRect().left + document.documentElement.scrollLeft - containerCenterW,
        }            
      }
}

function getGlobalPoint(e){
     var pt = SVG.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
     return pt.matrixTransform(SVG.getScreenCTM().inverse());
}


function createSvgElement(n, v) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n);
    for (let p in v)
        n.setAttributeNS(null, p, v[p]);
    return n
};


/*resizes the svg to fit the current circle*/
function resizeSVG(circle) {

    SVG.width.baseVal.value = circle.radius * 2.75;
    SVG.height.baseVal.value = circle.radius * 2.75;
    let viewBoxString = "0 0 " + circle.radius * 2.75 + " " + circle.radius * 2.75;
    SVG.setAttribute("viewBox", viewBoxString)

    let centerContainer = SVG.width.baseVal.value / 2;

    for (let currCircle of CirclesArray) {

        currCircle.slider.cx.baseVal.value = centerContainer;
        currCircle.slider.cy.baseVal.value = centerContainer;

        currCircle.cx = centerContainer;
        currCircle.cy = centerContainer;
        
        let knobPositions = getKnobPosition(currCircle.startAngle, currCircle.radius, centerContainer);

        currCircle.knob.cx.baseVal.value = knobPositions.knobX;
        currCircle.knob.cy.baseVal.value = knobPositions.knobY;

    }
}

const toRadian = (angle) => angle * Math.PI/180;


