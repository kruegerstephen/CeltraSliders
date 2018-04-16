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
    
        this.name   = defaultFlag ? "circle"    : options.name
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



 
function moveKnob(fullSlider, stepAngle){
    
    let circle = fullSlider.sCircle;
    let knob = fullSlider.sKnob;
    let radius = circle.r.baseVal.value;
    let centerX = circle.cx.baseVal.value;
    
    let radian = toRadian(stepAngle);
    
    let newY = -Math.round(Math.sin(radian)*radius) + centerX;
    let newX = Math.round(Math.cos(radian)*radius)+ centerX;
    
    knob.cx.baseVal.value = newX;
    knob.cy.baseVal.value = newY;
    
    //moves knob to bottom of dom, which keeps it on top of all other elements
    container.appendChild(knob);
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


function valueConversion(fullSlider, stepAngle, angle){
    
    circle = fullSlider.sCircle;
    let maxVal = parseInt(circle.attributes.maxVal.value);
    let minVal = parseInt(circle.attributes.minVal.value);
    let stepVal = maxVal-minVal;
    let step = parseInt(circle.attributes.step.value);
    let value = ((stepAngle+180)/360) * stepVal;
    console.log((stepAngle+180)/360);
    value = Math.abs((stepVal)-Math.floor(value/step)*step);
    let floorVal = stepVal- Math.abs((stepVal)-Math.floor(value/step)*step);
    let ceilVal =  stepVal - Math.abs((stepVal)-Math.ceil(value/step)*step);
    let unrounded = stepVal - Math.abs((stepVal)-(value/step)*step);
    console.log(angle, stepAngle);
    
    if(-175 >= angle && angle >= -179 && value<=stepVal)
  {
        value = maxVal;
        moveKnob(fullSlider, -179);
        drawPath(fullSlider, -179);
   } else if(value + minVal == step && minVal < step){
       value = minVal;
   }else if(value + minVal == maxVal && 0 ===(stepAngle+180)/360){
       value = maxVal;
       moveKnob(fullSlider, -179);
       drawPath(fullSlider, -179);
   }
    else{
        if(value<minVal){
            value = minVal;
        }else{
            value = minVal + floorVal;
        }
    }
    

    displayValue(circle, value);
}


function displayValue(circle, value){
    let circleDisplayID = circle.id + "valueDisp";
    let dispDIV = document.getElementById(circleDisplayID);
    dispDIV.innerHTML = value;
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


    let allowMove = false;

    function start(e){
      moveThisKnob = this;
      allowMove = true;
    }

 
    function move(e){
        e.preventDefault();
              if(allowMove || e.type == "click"){                       

                  let containerCenterW = container.clientWidth/2;
                  let slilderCircle;
                
                  let y,x;

                  if(e.type == "mousemove")
                  {
                     y = containerCenterW- e.offsetY;
                     x = e.offsetX - containerCenterW; 
                     sliderCircle = getSliderPartsByID(moveThisKnob.attributes.pID.value);
  
                  }else if(e.type == "click"){
                      allowMove = false;
                      y = containerCenterW- e.offsetY;
                      x = e.offsetX - containerCenterW;
                      if(this.nodeName === "path"){
                        sliderCircle = getSliderPartsByID(this.attributes.pathID.value);
                      }else{
                        sliderCircle = getSliderPartsByID(this.id);
                      }
                  }
                  else if(e.type == "touchmove"){
                     y = container.getBoundingClientRect().top + document.documentElement.scrollTop + containerCenterW - e.touches[0].pageY;
                     x = e.touches[0].pageX - container.getBoundingClientRect().left + document.documentElement.scrollLeft - containerCenterW;
                     sliderCircle = getSliderPartsByID(moveThisKnob.attributes.pID.value);
                      console.log(x,y);
  
                  }

                let radian = Math.atan2(y, x);
                let angle = radian*180/Math.PI;
                let stepAngle = getStepAngle(sliderCircle.sCircle, angle);
                  console.log(angle);
                drawPath(sliderCircle, stepAngle);
                moveKnob(sliderCircle, stepAngle);
                valueConversion(sliderCircle, stepAngle, angle);

              }
            
     }

    function end(e){
      allowMove = false;
    
    }


function circleRadiusSpacer(){    
    return 50 + ((getAllCircles().length)+1) * 50;
}

const toRadian = (angle) => angle * Math.PI/180;


function getAllSVGElements(){
     return Array.from(container.childNodes);
};

function getAllCircles(){
        return getAllSVGElements.call().filter(child => child.nodeName =="circle" && child.attributes.pID == undefined);
};

function getAllKnobs(){
        return getAllSVGElements.call().filter(child => child.attributes.pID != undefined);
};

function getAllPaths(){
        return getAllSVGElements.call().filter(child => child.nodeName =="path");
};

function getPathById(id){
    getAllPaths.call().filter(child => child.attributes.pathID.value == id)[0]; 
}

function getSliderPartsByID(id){
    
    let sliderCircle = getAllCircles.call().filter(child => child.id == id && child.attributes.pID == undefined)[0];
    let sliderKnob = getAllKnobs.call().filter(child => child.attributes.pID.value == id)[0];
    let sliderPath = getAllPaths.call().filter(child => child.attributes.pathID.value == id)[0]; 
    return {
        sCircle: sliderCircle,
        sKnob: sliderKnob,
        sPath: sliderPath
    }
}

function createSvgElement(n, v) {
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (let p in v)
    n.setAttributeNS(null, p, v[p]);
  return n
};

function resizeSVG(circle){

    container.width.baseVal.value = circle.radius*2.75;
    container.height.baseVal.value = circle.radius*2.75;
    let viewBoxString = "0 0 " + circle.radius*2.75 + " " + circle.radius*2.75;
    container.setAttribute("viewBox", viewBoxString)

    let centerContainer = container.width.baseVal.value/2;

    let allCircles = getAllCircles();

    for(let circle of allCircles){

        let slider = getSliderPartsByID(circle.id);

        slider.sCircle.cx.baseVal.value = centerContainer;
        slider.sCircle.cy.baseVal.value = centerContainer;

        let knobPositions = getKnobPosition(slider.sCircle.attributes.startAngle.value, slider.sCircle.r.baseVal.value, centerContainer);

        slider.sKnob.cx.baseVal.value = knobPositions.knobX;
        slider.sKnob.cy.baseVal.value = knobPositions.knobY;

    }
}


