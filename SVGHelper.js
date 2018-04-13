function getNode(n, v) {
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (let p in v)
    n.setAttributeNS(null, p, v[p]);
  return n
};


function getAllSVGElements(){
     return Array.from(container.childNodes);
};

function getAllCircles(){
        return getAllSVGElements.call().filter(child => child.nodeName =="circle");
};

function getAllKnobs(){
        return getAllCircles.call().filter(child => child.attributes.pID != undefined);
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
