function CircleWidget(options){
    
        let defaultFlag = false;
        if(options === undefined){
            defaultFlag = true;
        }
    
        this.color  = defaultFlag ? options.color  :  "blue",
        this.maxVal = defaultFlag ? options.maxVal : 100,
        this.minVal = defaultFlag ? options.minVal : 0,
        this.step   = defaultFlag ? options.step   : 1,
        this.radius = defaultFlag ? options.radius : circleRadiusSpacer(),
        this.strokewidth = defaultFlag ? options.strokewidth : 30;
}


function CreateCircle(options){
    
    let circle = new CircleWidget(options);
    circle.DrawCircle();
    circle.AddEventHandlers();
    circle.CreateDisplayField();    
}


CircleWidget.prototype.DrawCircle = function drawCircle(){

    
        let startAngle = -90*Math.PI/180;

        //Resize the SVG if the circle will be out of the viewbox
        if(container.width.baseVal.value < this.radius*2.5 || container.height.baseVal.value<this.radius*2.5){
          resizeSVG(this, startAngle);
        }
    
       let centerContainer = container.clientWidth/2;

       let circleID = "circ" + getAllCircles().length.toString(); 
       this.id = circleID;
    
    
        let circleSlider = createSvgElement("circle", { id : circleID,
                                    cx : centerContainer,
                                    cy : centerContainer,
                                    r  : this.radius,
                                    strokeColor: this.color,
                                    maxVal : this.maxVal,
                                    minVal : this.minVal,
                                    step : this.step,
                                    fill : "none",
                                    stroke : "grey",
                                    "stroke-opacity" : .4,
                                    "stroke-width": this.strokewidth
                                    });

    
        let knob = this.CreateKnob();
        
        container.appendChild(circleSlider);
        container.appendChild(knob);
        this.container = container;
        this.svgElem = r;

};



CircleWidget.prototype.AddEventHandlers =  function AddEventHandlers(){
        
        let knob = getAllKnobs.call().filter(kn => kn.getAttribute("pID") == this.id)[0];
       
        //
        knob.addEventListener("touchstart", start , false);
        knob.addEventListener("touchmove", move , false);
        knob.addEventListener("touchend", end , false);
        
        knob.addEventListener("mousedown", start , false);
    
        this.container.addEventListener("mouseup", end , true);
        this.container.addEventListener("mousemove", move, true);
        this.container.addEventListener("mouseup", end , true);
        this.container.addEventListener("mousemove", move, true);
        
        this.svgElem.addEventListener("click", move, false);
        this.svgElem.addEventListener("touchenter", move, false);

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


CircleWidget.prototype.CreateKnob = function CreateKnob(){
    
    let knobXY = getKnobPosition(startAngle, this.radius, centerContainer);
    
    return createSvgElement("circle", { pID  : circleID,
                                        cx   : knobXY.knobX,
                                        cy   : knobXY.knobY,
                                        r    : this.strokewidth-10,
                                        fill : "#EDEEEE",
                                        stroke : "none"});
}


 
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
         
     let circPath = getAllPaths().filter(child => child.attributes.pathID.value == fullSlider.sCircle.id)[0]; 
     let circle = fullSlider.sCircle; 
    
    
    
     let strokewidth = circle.attributes["stroke-width"].value;

     let x = createSvgElement("path", {  pathID : circle.id,
                                fill : "none",
                                stroke : circle.attributes.strokeColor.value,
                                "stroke-opacity" : .8,
                                "stroke-width":strokewidth,
                                d:generateArc(circle, Math.abs(angle-180))});

    
    x.addEventListener("click", move, false);

    
    if(circPath != undefined ){
        container.replaceChild(x,circPath);
    }else{
        container.appendChild(x);
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


