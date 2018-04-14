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

    container.width.baseVal.value = circle.radius*2.5;
    container.height.baseVal.value = circle.radius*2.5;

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
